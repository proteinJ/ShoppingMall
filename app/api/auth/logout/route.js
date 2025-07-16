import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ success: false, message: "이미 로그아웃 상태입니다. "}, { status: 400 });
        }
        const user_tokens = await prisma.userRefreshToken.findMany({
            where: { refresh_token: refreshToken }
        });

        // 로그인 상태가 아니라면 (현재 refreshToken이 DB에 없다면)
        if (user_tokens.length === 0) { 
            cookieStore.delete("accessToken");
            cookieStore.delete("refreshToken");
            await prisma.$disconnect();
            return NextResponse.json({ success: false, message: "이미 로그아웃 상태입니다. "}, { status: 400 });
        }

        // 로그인 상태라면 (현재 refreshToken이 DB에서 발견 되었다면)
        const userId = user_tokens[0].user_id;
        await prisma.user.update({
            where: { id: userId },
            data: { logout_time: new Date() }
        })

        await prisma.userRefreshToken.deleteMany({
            where: { refresh_token: refreshToken }
        });

        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        
        
        return NextResponse.json({ success: true, message: "로그아웃 완료" }, { status: 200 })
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌로그아웃 로직 실패 error: ${error.message}`);
        return NextResponse.json({ success: false, message: "로그아웃 로직 실패" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
    
}