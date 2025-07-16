// 상품 등록(POST)/목록(GET)


import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getLoginUser } from '@/lib/auth';

const prisma = new PrismaClient();

// 상품 등록(POST)
export async function POST(request) {
  try {
    const payload = await getLoginUser();
    if (!payload) {
      return NextResponse.json({
        success: false,
        message: '로그인 후 이용 가능합니다.',
      }, { status: 401 });
    }
    console.log(payload.role);

    if (payload.role !== "admin") {
        return NextResponse.json({
            success: false,
            message: '관리자만 상품을 등록할 수 있습니다.',
          }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const price = Number(formData.get('price'));
    const categoryId = Number(formData.get('categoryId'));

        await prisma.product.create({
            data: {
                name,
                description,
                price,
                categoryId,
            },
        });

      console.log(`[${new Date().toISOString()}] [INFO] ✅ 상품 등록 완료`);
      return NextResponse.json({ success: true, message: `상품 등록 완료` }, { status: 200 });
  } catch (error) {
    console.log(`[${new Date().toISOString()}] [ERROR] ❌ 상품 등록 로직 실패 ${error}`);
    return NextResponse.json({ success: false, message: `상품 등록 로직 실패: ${error}` }, { status: 500 });
  }
}

// 상품 목록 조회(GET)
export async function GET(request) {
    try {
      // 상품 목록 조회 (모든 사용자 동일)
      const Products = await prisma.product.findMany({
          select: {
              id: true,
              name: true,
              description: true,
              price: true,
              stock: true,
              status: true,
              categoryId: true,
            }
        });

        if (Products) {
          console.log(`[${new Date().toISOString()}] [INFO] ✅ 상품 목록 조회 완료`);
          return NextResponse.json({ success: true, Products }, { status: 200 });
        } else {
          console.log(`[${new Date().toISOString()}] [WARN] 🚫 상품 목록 정보 없음`);
          return NextResponse.json({ success: true, message: "상품 목록 정보 없음" }, { status: 404 });
        }
          
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 상품 목록 조회 로직 실패 - error ${error}`);
        return NextResponse.json({ success: false, message: "상품 목록 조회 로직 실패" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}