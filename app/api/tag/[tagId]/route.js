// 태그 상세(GET)/수정(PUT)/삭제(DELETE)
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getLoginUser } from '@/lib/auth';

// 태그 상세(GET)
export async function GET(request, { params }) {
    try {
        const { tagId } = await params;

        const FoundTag = await prisma.tag.findUnique({
            where: { id: Number(tagId), is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
              }
          });

          if (FoundTag) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 태그 조회 완료 - ${tagId}`);
            return NextResponse.json({ success: true, message: "태그 조회 완료", FoundTag }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 조회 할 태그 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "조회 할 태그 정보가 없습니다." }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 태그 조회 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `태그 조회 로직 실패: ${error}` }, { status: 500 });
      }
}

// 태그 수정(PUT)
export async function PUT(request, { params }) {
    try {
        const payload = await getLoginUser();

        if (!payload || payload.role !== "admin") {
            return NextResponse.json({
                success: false,
                message: '관리자만 태그를 수정할 수 있습니다.',
            }, { status: 401 });
        }

        const { tagId } = await params;

        const is_tag = await prisma.tag.findUnique({
            where: { id: Number(tagId), is_deleted: false },
          });

        if (!is_tag) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 수정 할 태그 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "수정 할 태그이 없음" }, { status: 404 });
        }

        const { name, description } = await request.json();

        const Updatedtag = await prisma.tag.update({
            where: { id: Number(tagId) },
            data: {
                name,
                description,  
              }
          });

          if (Updatedtag) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 태그 수정 완료 - ${tagId}`);
            return NextResponse.json({ success: true, message: "태그 수정 완료", Updatedtag }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 태그 수정 실패 - ${tagId}`);
            return NextResponse.json({ success: false, message: "태그 수정 실패" }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 태그 수정 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `태그 수정 로직 실패: ${error}` }, { status: 500 });
      }
}

// 삭제(DELETE)

export async function DELETE(request, { params }) {
    try {
        const payload = await getLoginUser();

        if (!payload || payload.role !== "admin") {
            return NextResponse.json({
                success: false,
                message: '관리자만 태그를 삭제할 수 있습니다.',
            }, { status: 401 });
        }

        const { tagId } = await params;

        const is_tag = await prisma.tag.findUnique({
            where: { id: Number(tagId) },
          });

        if (!is_tag) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 삭제 할 태그 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "삭제 할 태그 정보가 없습니다." }, { status: 404 });
        }

        // 연결된 상품이 있는지 확인
        const relatedProducts = await prisma.productTag.findMany({
            where: { tagId: Number(tagId) }
        });

        if (relatedProducts.length > 0) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 연결된 상품이 있어 태그 삭제 불가 - ${tagId}`);
            return NextResponse.json({
                success: false,
                message: "태그에 연결된 상품이 있어 삭제할 수 없습니다.",
                relatedProductsCount: relatedProducts.length
            }, { status: 409 }); // 409 Conflict
        }

        const Deletedtag = await prisma.tag.update({
            where: { id: Number(tagId) },
            data: {
              is_deleted: true,
              deletedAt: new Date()
            }
          });

          if (Deletedtag) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 태그 삭제 완료 - ${tagId}`);
            return NextResponse.json({ success: true, message: "태그 삭제 완료", Deletedtag }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 태그 삭제 실패 - ${tagId}`);
            return NextResponse.json({ success: false, message: "태그 삭제 실패" }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 태그 삭제 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `태그 삭제 로직 실패: ${error}` }, { status: 500 });
      }
}