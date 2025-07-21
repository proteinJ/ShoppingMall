// 카테고리 등록(POST)/목록(GET)


import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getLoginUser } from '@/lib/auth';

const prisma = new PrismaClient();

// 카테고리 등록(POST)
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
            message: '관리자만 카테고리를 등록할 수 있습니다.',
          }, { status: 401 });
    }

    const { name, description, slug } = await request.json();

    const is_category = await prisma.category.findUnique({
        where: { slug }
    })

    if (is_category) {
        console.log(`[${new Date().toISOString()}] [WARN] ❌ 중복 카테고리 있음: Slug 중복 ${slug}`);
        return NextResponse.json({ success: false, message: `중복 카테고리 있음: Slug 중복: ${slug}` }, { status: 401 });
    }

    await prisma.category.create({
        data: {
            name,
            description,
            slug,
        }
      });

        console.log(`[${new Date().toISOString()}] [INFO] ✅ 카테고리 등록 완료 - ${name}`);
        return NextResponse.json({ success: true, message: `카테고리 등록 완료` }, { status: 200 });
  } catch (error) {
    console.log(`[${new Date().toISOString()}] [ERROR] ❌ 카테고리 등록 로직 실패 ${error}`);
    return NextResponse.json({ success: false, message: `카테고리 등록 로직 실패: ${error}` }, { status: 500 });
  }
}

// 카테고리 목록 조회(GET)
export async function GET() {
    try {
        const payload = await getLoginUser();

        if (!payload || payload.role !== "admin") {
            return NextResponse.json({
                success: false,
                message: '관리자만 카테고리 목록을 조회할 수 있습니다.',
            }, { status: 401 });
        }

        const categories = await prisma.category.findMany({
            where: { is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (categories) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 카테고리 목록 조회 완료`);
            return NextResponse.json({ success: true, categories }, { status: 200 });
        } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 카테고리 목록 정보가 없음.`);
            return NextResponse.json({ success: false }, { status: 200 });
        }
        
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 카테고리 목록 조회 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `카테고리 목록 조회 로직 실패: ${error}` }, { status: 500 });
    } finally {
        prisma.$disconnect();
    }
}