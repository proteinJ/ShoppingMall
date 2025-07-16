import { hashPassword } from "@/lib/auth";
import { validateRegisterForm } from "@/lib/validate";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerUser({ email, password, name, phone }) {
    // 회원가입 로직
    try {
        const validateMsg = validateRegisterForm({ email, password, name, phone });
        if(validateMsg) {
            console.log(`[${new Date().toISOString()}] [WARN] ${validateMsg}`);
            return NextResponse.json(
                { success: false, message: validateMsg },
                { status: 400 }
            );
        }

        // 중복 체크
        const existUser = await prisma.user.findUnique({
            where: { email }
        });

        // 비밀번호 해시
        const user_password = await hashPassword(password);

        // 탈퇴 회원이였던 경우 - 복구
        if (existUser && existUser.is_deleted) {
            await prisma.user.update({
                where: { id: existUser.id },
                data: { 
                    is_deleted: false,
                    email,
                    password: user_password,
                    name,
                    phone
                }
            })
            console.log(`[${new Date().toISOString()}] [INFO] ✅회원가입 성공, [탈퇴 회원 복구] email: ${email}`);
            return NextResponse.json(
                { success: true, message: "회원가입 성공[탈퇴 회원 복구]" },
                { status: 201 }
            );

        } else if (existUser) { // 중복 회원인 경우 - 실패
            console.log(`[${new Date().toISOString()}] [INFO] ❌중복 회원이 있습니다. 회원가입 실패`);
            return NextResponse.json(
                { success: false, message: "중복된 email이 있습니다." },
                { status: 409 }
            );
        }

        // 중복된 email이 없는 경우 - 회원가입 진행
        const newUser = await prisma.user.create({
            data: {
                email,
                password: user_password,
                name,
                phone
            }
        });

        console.log(`[${new Date().toISOString()}] [INFO] ✅회원가입 성공 email: ${email}`);
        return NextResponse.json(
            { success: true, message: "회원가입 성공" },
            { status: 201 }     
        );

    } catch (error) {
        console.log("❌ [회원가입 로직 실패]", error);
        return NextResponse.json(
            { success: false, message: "회원가입 로직 실패" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}