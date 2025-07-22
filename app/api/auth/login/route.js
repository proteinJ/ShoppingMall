// login 로직
import prisma from '@/lib/prisma';
import { verifyPassword, setAuthCookies } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";



export async function POST(request) {

	// 로그인 로직 단계
	try {
		const { email, password } = await request.json();
		console.log(`[${new Date().toISOString()}] [INFO] 로그인 시도 - email: ${email}`);

		// Prisma로 유저 조회
		const user = await prisma.user.findUnique({
			where: {
			  email: email,
			  is_deleted: false
			},
		  });

		// 유저 존재 유무 확인
        if (!user) {
            console.log(`[${new Date().toISOString()}] [WARN] ❌존재하지 않는 사용자 - email: ${email}`);
            return NextResponse.json({ success: false, message: "존재하지 않는 사용자입니다." }, { status: 401 });
        }

		// 계정 잠금 유무 확인
		if (user.is_locked) {
			console.log(`[${new Date().toISOString()}] [WARN] 🚫계정 잠김 - email: ${email}`);
			return  NextResponse.json({ success: false, message: "계정이 잠겼습니다. 비밀번호를 변경해 주세요." }, { status: 403 });
		}

		const userId = user.id;
		const role = user.role;
		const isMatch = await verifyPassword(password, user.password);

		if (isMatch) {

			const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
			
			const expiresInSec = 60 * 60 * 24 * 7; // 7일 (만료 기간)
			const expiredAt = new Date(Date.now() + expiresInSec * 1000); // 만료일
			const user_agent = request.headers.get("user-agent") || ""; // 사용자 기기

			// 값 확인용 로그 추가
			console.log("userId:", userId);
			console.log("refreshToken:", refreshToken);
			console.log("expiredAt:", expiredAt);
			console.log("user_agent:", user_agent);
		
			// DB에 refreshToken 저장 (upsert)
			await prisma.userRefreshToken.upsert({
				where: {
				  user_id: userId,
				},
				update: {
				  refresh_token: refreshToken,
				  expired_at: expiredAt,
				  user_agent: user_agent,
				},
				create: {
				  user_id: userId,
				  refresh_token: refreshToken,
				  expired_at: expiredAt,
				  user_agent: user_agent,
				},
			  });

			// userId를 JWT에 넣어 쿠키로 저장
			await setAuthCookies(userId, email, role, refreshToken);

			// 로그인 성공 시 로그인 시간 갱신 및 실패 횟수 초기화
			await prisma.user.update({
				where: {
				  id: userId,
				  is_deleted: false
				},
				data: {
				  login_time: new Date(),
				  fail_login_count: 0,
				},
			  });
			
			console.log(`[${new Date().toISOString()}] [INFO] ✅로그인 성공 - userId: ${user.id}, email: ${email}`);
			return NextResponse.json({ success: true, message: "로그인 성공" }, { status: 200 });
		} else {
			// 실패 횟수 증가 및 잠금 처리
            const newFailCount = user.fail_login_count + 1;
			await prisma.user.update({
				where: {
				  	id: userId,
				},
				data: {
				  fail_login_count: newFailCount,
				  is_locked: newFailCount >= 5,
				},
			  });
			
			if (user.fail_login_count >= 2) {
				console.log(`[${new Date().toISOString()}] [WARN] ❌비밀번호 불일치 : 알림! 비밀번호 5회 이상 틀릴 시 계정이 잠깁니다.- email: ${email}`);
				return  NextResponse.json({ success: false, message: "로그인 실패 :: 알림! 비밀번호 5회 이상 틀릴 시 계정이 잠깁니다." }, { status: 401 });
			}

			console.log(`[${new Date().toISOString()}] [WARN] ❌비밀번호 불일치 - email: ${email}`);
			return  NextResponse.json({ success: false, message: "로그인 실패" }, { status: 401 });
		}

	} catch (error) {
		console.log(`[${new Date().toISOString()}] [ERROR] ❌로그인 로직 실패 - error: ${error.message}`);
		return NextResponse.json({ success: false, message: "로그인 로직 실패" }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
} 
