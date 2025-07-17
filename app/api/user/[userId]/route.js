// 유저 정보 상세(GET), 수정(PATCH), 삭제(DELETE)
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getLoginUser } from "@/lib/auth";
import { validateUpdateForm } from "@/lib/validate";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// 유저 정보 상세(GET)
export async function GET(request, { params }) {
    try {
        const userId = Number(params.userId);
        const payload = await getLoginUser();

        // Case1. 내 정보 조회인 경우
        if (payload && payload.userId === Number(userId)) {
            const user = await prisma.user.findUnique({
                where: { id: userId, is_deleted: false },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
        

        if (!user) {
            console.log(`[${new Date().toISOString()}] [WARN] ❌ 해당 사용자 없음 - UserId: ${userId}`);
            return NextResponse.json({ success: false, message: "해당 사용자 없음" }, { status: 404 });
        }

        console.log(`[${new Date().toISOString()}] [INFO] ✅ 정보 조회 완료. - UserId: ${userId}`);
        return NextResponse.json({ success: true, user }, { status: 200 });
        } 
        // Case2. 다른 사람 정보 조회인 경우
        else if (payload) {
            const isAdmin = payload.role === 'admin';

            if (!isAdmin) {
                console.log(`[${new Date().toISOString()}] [WARN] ❌ 해당 사용자 정보 조회 권한 없음 - UserId: ${userId}`);
                return NextResponse.json({ success: false, message: "해당 사용자 정보 조회 권한 없음" }, { status: 403 });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId, is_deleted: false },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            console.log(`[${new Date().toISOString()}] [INFO] ✅ 다른 사용자 정보 조회 완료 (관리자) - UserId: ${userId}`);
            return NextResponse.json({ success: true, user }, { status: 200 });
        } 
        // Case3. 로그인 하지 않은 경우
        else {
            console.log(`[${new Date().toISOString()}] [WARN] ❌ 로그인 정보 없음`);
            return NextResponse.json({ success: false, message: "로그인 정보 없음" }, { status: 401 });
        }

    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌인증 실패`);
        return NextResponse.json({ success: false, message: "인증 실패"}, { status: 401 })
    } finally {
        await prisma.$disconnect();
    }
}

// 유저 수정(PATCH)
export async function PATCH(request) {
    try {
        const payload = await getLoginUser();

        if (!payload) {
            console.log(`[${new Date().toISOString()}] [ERROR] ❌ accessToken(인증정보)가 없습니다.`);
            return NextResponse.json({ success: false, message: "accessToken(인증정보)가 없습니다."}, { status: 401 });
        }

        const userId = payload.userId;
        const email = payload.email;
        const data = await request.json();
        const userUpdateData = {};
        

        // White List
        const allowedFields = ["email", "password", "user_name"];         

        for(const [key, value] of Object.entries(data)) {
            let error;
            if (allowedFields.includes(key)) { // 1. allowedFields 에 해당하는 정보 변경인 경우
                if (key === "password") {
                    error = validateUpdateForm(key, value, email);
                } else {
                    error = validateUpdateForm(key, value);
                }
                if (error) { return NextResponse.json({ success: false, message: error }, { status: 400 }) }
    
                if (!allowedFields.includes(key)) continue;
                if (key === "password") {
                    userUpdateData.password = await hashPassword(value);
                    // 비밀번호 변경 시 잠금 해제 및 실패 횟수 초기화
                    userUpdateData.is_locked = false;
                    userUpdateData.fail_login_count = 0;       
                } else if (key === "user_name") {
                    userUpdateData["name"] = value;
                } else {
                    userUpdateData[key] = value;
                }
            } 
            
        userUpdateData.updatedAt = new Date();

        if(Object.keys(userUpdateData).length === 1 && userUpdateData.updatedAt) { // updatedAt 만 수정하는 경우, 즉 수정 정보 X.
            console.log(`[${new Date().toISOString()}] [ERROR] ❌수정할 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "수정할 정보가 없습니다."}, { status: 400 })
        } else {            
            await prisma.user.update({
                where: { id: userId, is_deleted: false },
                data: userUpdateData
            });
        }
    }
        
        console.log(`[${new Date().toISOString()}] [INFO] ✅정보 수정 완료`);
        return NextResponse.json({ success: true, message: "정보 수정 완료"}, { status: 200 })
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌정보 수정 로직 실패 error: ${error.message}`);
        return NextResponse.json({ success: false, message: "정보 수정 로직 실패" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}




// 유저 삭제(DELETE)
export async function DELETE(request) {
    try {
        const payload = await getLoginUser();

        if (payload) {
            const userId = payload.userId;
            await prisma.user.update({
                where: { id: userId, is_deleted: false },
                data: {
                    is_deleted: true,
                    deleted_at: new Date()
                }
            });

            const cookieStore = await cookies();
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            
            console.log(`[${new Date().toISOString()}] [INFO] ✅회원탈퇴 완료 - userId: ${userId}`);
            return NextResponse.json({ success: true, message: "회원탈퇴 완료" }, { status: 200 });
        } else {
            console.log(`[${new Date().toISOString()}] [WARN] ❌로그인 정보 없음` );
            return NextResponse.json({ success: false, message: "로그인 정보 없음" }, { status: 401 });
        }
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌회원탈퇴 실패`, error);
        return NextResponse.json({ success: false, message: "회원탈퇴 실패" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}