// 태그 등록(POST)/목록(GET)
import { NextResponse } from 'next/server';
import { getLoginUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 태그 등록(POST)
export async function POST(request) {
  try {
    const payload = await getLoginUser();
    if (!payload) {
      return NextResponse.json({
        success: false,
        message: '로그인 후 이용 가능합니다.',
      }, { status: 401 });
    }

    if (!payload || payload.role !== "admin") {
        return NextResponse.json({
            success: false,
            message: '관리자만 태그를 등록할 수 있습니다.',
          }, { status: 401 });
    }

    const { name, description } = await request.json();

    const is_tag = await prisma.tag.findUnique({
        where: { name }
    })

    if (is_tag) {
        console.log(`[${new Date().toISOString()}] [WARN] ❌ 중복 태그 있음: name 중복 ${name}`);
        return NextResponse.json({ success: false, message: `중복 태그 있음: name 중복: ${name}` }, { status: 401 });
    } 

    await prisma.tag.create({
        data: {
            name,
            description,
        }
      });

        console.log(`[${new Date().toISOString()}] [INFO] ✅ 태그 등록 완료 - ${name}`);
        return NextResponse.json({ success: true, message: `태그 등록 완료` }, { status: 200 });
  } catch (error) {
    console.log(`[${new Date().toISOString()}] [ERROR] ❌ 태그 등록 로직 실패 ${error}`);
    return NextResponse.json({ success: false, message: `태그 등록 로직 실패: ${error}` }, { status: 500 });
  }
}

// 태그 목록 조회(GET)
export async function GET() {
    try {
        const payload = await getLoginUser();

        if (!payload || payload.role !== "admin") {
            return NextResponse.json({
                success: false,
                message: '관리자만 태그 목록을 조회할 수 있습니다.',
            }, { status: 401 });
        }

        const tags = await prisma.tag.findMany({
            where: { is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (tags) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 태그 목록 조회 완료`);
            return NextResponse.json({ success: true, tags }, { status: 200 });
        } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 태그 목록 정보가 없음.`);
            return NextResponse.json({ success: false }, { status: 200 });
        }
        
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 태그 목록 조회 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `태그 목록 조회 로직 실패: ${error}` }, { status: 500 });
    } finally {
        prisma.$disconnect();
    }
}