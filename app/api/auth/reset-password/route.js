// 전화번호를 통한 비밀번호 변경
import { hashPassword } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import { validateUpdateForm } from "@/lib/validate";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { phone_number, code, newPassword } = await request.json();

        const validCode = "123456";

        if (code !== validCode) {
            return NextResponse.json({ success: false, message: "인증 코드가 올바르지 않습니다." }, { status: 400 });
        }
        const validateMsg = validateUpdateForm("password", newPassword);
        if (validateMsg) {
            console.log(`[${new Date().toISOString()}] [WARN] ${validateMsg}`);
            return NextResponse.json(
                { success: false, message: validateMsg },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.updateMany({
            where: { phone_number: phone_number, is_deleted: false },
            data: {
                password: hashedPassword,
                fail_login_count: 0,
                is_locked: false
            }
        });

        return NextResponse.json({ success: true, message: "비밀번호 변경이 완료 되었습니다." });
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌비밀번호 변경 로직 실패 - error: ${error.message}`);
		return NextResponse.json({ success: false, message: "비밀번호 변경 로직 실패" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}