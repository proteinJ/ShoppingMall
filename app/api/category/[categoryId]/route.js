// 카테고리 상세(GET)/수정(PUT)/삭제(DELETE)



import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getLoginUser } from '@/lib/auth';

const prisma = new PrismaClient();

// 카테고리 상세(GET)
export async function GET(request, { params }) {
    try {
        const { categoryId } = await params;

        const FoundCategory = await prisma.category.findUnique({
            where: { id: Number(categoryId) },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
              }
          });

          if (FoundCategory) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 카테고리 조회 완료 - ${categoryId}`);
            return NextResponse.json({ success: true, message: "카테고리 조회 완료", FoundCategory }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 조회 할 카테고리 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "조회 할 카테고리 정보가 없습니다." }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 카테고리 조회 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `카테고리 조회 로직 실패: ${error}` }, { status: 500 });
      }
}

// 카테고리 수정(PUT)
export async function PUT(request, { params }) {
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
                message: '관리자만 카테고리을 등록할 수 있습니다.',
            }, { status: 401 });
        }

        const { categoryId } = await params;

        const is_category = await prisma.category.findUnique({
            where: { id: Number(categoryId) },
          });

        if (!is_category) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 수정 할 카테고리 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "수정 할 카테고리이 없음" }, { status: 404 });
        }

        const { name, description, slug } = await request.json();

        const UpdatedCategory = await prisma.category.update({
            where: { id: Number(categoryId) },
            data: {
                name,
                description,
                slug,  
              }
          });

          if (UpdatedCategory) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 카테고리 수정 완료 - ${categoryId}`);
            return NextResponse.json({ success: true, message: "카테고리 수정 완료", UpdatedCategory }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 카테고리 수정 실패 - ${categoryId}`);
            return NextResponse.json({ success: false, message: "카테고리 수정 실패" }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 카테고리 수정 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `카테고리 수정 로직 실패: ${error}` }, { status: 500 });
      }
}

// 삭제(DELETE)

export async function DELETE(request, { params }) {
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
                message: '관리자만 카테고리을 등록할 수 있습니다.',
            }, { status: 401 });
        }

        const { categoryId } = await params;

        const is_category = await prisma.category.findUnique({
            where: { id: Number(categoryId) },
          });

        if (!is_category) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 삭제 할 카테고리 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "삭제 할 카테고리 정보가 없습니다." }, { status: 404 });
        }

        // 연결된 상품이 있는지 확인
        const relatedProducts = await prisma.product.findMany({
            where: { categoryId: Number(categoryId) }
        });

        if (relatedProducts.length > 0) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 연결된 상품이 있어 카테고리 삭제 불가 - ${categoryId}`);
            return NextResponse.json({
                success: false,
                message: "카테고리에 연결된 상품이 있어 삭제할 수 없습니다.",
                relatedProductsCount: relatedProducts.length
            }, { status: 409 }); // 409 Conflict
        }

        const DeletedCategory = await prisma.category.delete({
            where: { id: Number(categoryId) },
          });

          if (DeletedCategory) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 카테고리 삭제 완료 - ${categoryId}`);
            return NextResponse.json({ success: true, message: "카테고리 삭제 완료", DeletedCategory }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 카테고리 삭제 실패 - ${categoryId}`);
            return NextResponse.json({ success: false, message: "카테고리 삭제 실패" }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 카테고리 삭제 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `카테고리 삭제 로직 실패: ${error}` }, { status: 500 });
      }
}