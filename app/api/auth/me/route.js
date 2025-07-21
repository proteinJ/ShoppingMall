/*  현재 로그인된 사용자 정보 조회
    토큰 유효성 검증
    프론트엔드에서 사용자 상태 확인
*/

import { NextResponse } from "next/server";
import { getLoginUser } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const userPayload = await getLoginUser();

        if (!userPayload) {
            console.log(`[${new Date().toISOString()}] [INFO] ❌ 로그인 되어 있지 않음.`);
            return NextResponse.json({ success: false, message: "로그인 되어 있지 않음."}, { status: 401 });
        }

        // 실제 사용자 정보 조회
        const user = await prisma.user.findUnique({
            where: { id: userPayload.userId },
            select: {
                id: true,
                name: true,
                role: true,
            }
        });

        if (!user) {
            console.log(`[${new Date().toISOString()}] [WARN] ❌ 사용자 정보를 찾을 수 없음`);
            return NextResponse.json({ success: false, message: "사용자 정보를 찾을 수 없음" }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            user: user
        }, { status: 200 });
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return NextResponse.json({ 
            success: false, 
            message: "서버 오류" 
        }, { status: 500 });
    } finally {
        prisma.$disconnect();
    }
}