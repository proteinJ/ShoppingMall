// refreshToken을 활용한 accessToken 재발급 Logic
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/* 
    * Frontend 연동 !
    프론트엔드에서 401 응답 받으면 /api/refresh 로 refreshToken을 보내서
    accessToken을 재발급.
    만약, refreshToken 도 만료/유효하지 않으면 세션 만료 안내 후 재로그인 안내.
*/

export async function POST() {
    const refreshToken = (await cookies()).get("refreshToken")?.value;
    if(!refreshToken) {
        return NextResponse.json({ sccess:false, message: "Refresh Token 없음"}, { status: 401 });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const newAccessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
        cookies().set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60, // 1시간
        });
        return NextResponse.json({ success: true, message: "Access Token 재발급 완료" }, { status: 200 });
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌refresh 로직 실패 error: ${error.message}`);
        return NextResponse.json({ success: false, message: "refresh 로직 실패" }, { status: 500 });
    }
}