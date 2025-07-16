// 상품 상세(GET)/수정(PUT)/삭제(DELETE)



import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getLoginUser } from '@/lib/auth';

const prisma = new PrismaClient();

// 상품 상세(GET)
export async function GET(request, { params }) {
    try {
        const { productId } = await params;

        const FoundProduct = await prisma.product.findUnique({
            where: { id: Number(productId) },
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

          if (FoundProduct) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 상품 조회 완료 - ${productId}`);
            return NextResponse.json({ success: true, message: "상품 조회 완료", FoundProduct }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 조회 할 상품 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "조회 할 상품 정보가 없습니다." }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 상품 조회 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `상품 조회 로직 실패: ${error}` }, { status: 500 });
      }
}

// 상품 수정(PUT)
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
                message: '관리자만 상품을 등록할 수 있습니다.',
            }, { status: 401 });
        }

        const { productId } = await params;

        const is_product = await prisma.product.findUnique({
            where: { id: Number(productId) },
          });

        if (!is_product) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 수정 할 상품 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "수정 할 상품이 없음" }, { status: 404 });
        }

        const name = formData.get('name') ?? is_product.name;
        const description = formData.get('description') ?? is_product.description;
        const price = formData.get('price') !== null ? Number(formData.get('price')) : is_product.price;
        const status = formData.get('status') ?? is_product.status;
        const stock = formData.get('stock') !== null ? Number(formData.get('stock')) : is_product.stock;
        const categoryId = formData.get('categoryId') !== null ? Number(formData.get('categoryId')) : is_product.categoryId;

        const UpdatedProduct = await prisma.product.update({
            where: { id: Number(productId) },
            data: {
                name,
                description,
                price,
                stock,
                status,
                categoryId,
              }
          });

          if (UpdatedProduct) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 상품 수정 완료 - ${productId}`);
            return NextResponse.json({ success: true, message: "상품 수정 완료", UpdatedProduct }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 상품 수정 실패 - ${productId}`);
            return NextResponse.json({ success: false, message: "상품 수정 실패" }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 상품 수정 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `상품 수정 로직 실패: ${error}` }, { status: 500 });
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
                message: '관리자만 상품을 등록할 수 있습니다.',
            }, { status: 401 });
        }

        const { productId } = await params;

        const is_product = await prisma.product.findUnique({
            where: { id: Number(productId) },
          });

        if (!is_product) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 삭제 할 상품 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "삭제 할 상품 정보가 없습니다." }, { status: 404 });
        }

        const DeletedProduct = await prisma.product.delete({
            where: { id: Number(productId) },
          });

          if (DeletedProduct) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 상품 삭제 완료 - ${productId}`);
            return NextResponse.json({ success: true, message: "상품 삭제 완료", DeletedProduct }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 상품 삭제 실패 - ${productId}`);
            return NextResponse.json({ success: false, message: "상품 삭제 실패" }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 상품 삭제 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `상품 삭제 로직 실패: ${error}` }, { status: 500 });
      }
}