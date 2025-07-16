// auth.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// 비밀번호 해싱 함수
export async function hashPassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

// 비밀번호 비교 함수
export async function verifyPassword(plainPassword, hash) {
    return await bcrypt.compare(plainPassword, hash);
}

// jwt 토큰 생성
export async function setAuthCookies(userId, email, refreshToken) {
    const accessToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1시간
    });
    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7일
    });
}

// 로그인 유무 확인
export async function getLoginUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return null;
    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
        // payload가 유효한 객체인지 확인
        if (typeof payload !== 'object' || payload === null) {
            console.log(`[${new Date().toISOString()}] [WARN] ❌ 유효하지 않은 payload: ${payload}`);
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}