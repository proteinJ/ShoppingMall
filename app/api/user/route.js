// 유저 목록 조회(GET)
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getLoginUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
    try {
            const payload = await getLoginUser();
            if (!payload) {
            return NextResponse.json({
                success: false,
                message: '로그인 후 이용 가능합니다.',
            }, { status: 401 });
            }
    
            if (payload.role !== "admin") {
                return NextResponse.json({
                    success: false,
                    message: '관리자만 유저 목록을 조회할 수 있습니다.',
                }, { status: 401 });
            }
    
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    login_time: true,
                    logout_time: true,
                    fail_login_count: true,
                    is_locked: true,
                    is_deleted: true,
                    deletedAt: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
    
            if (users) {
                console.log(`[${new Date().toISOString()}] [INFO] ✅ 유저 목록 조회 완료`);
                return NextResponse.json({ success: true, users }, { status: 200 });
            } else {
                console.log(`[${new Date().toISOString()}] [WARN] 🚫 유저 목록 정보가 없음.`);
                return NextResponse.json({ success: false }, { status: 200 });
            }
            
        } catch (error) {
            console.log(`[${new Date().toISOString()}] [ERROR] ❌ 유저 목록 조회 로직 실패 ${error}`);
            return NextResponse.json({ success: false, message: `유저 목록 조회 로직 실패: ${error}` }, { status: 500 });
        } finally {
            prisma.$disconnect();
        }
}
