// 주소 수정(PUT)/삭제(DELETE)
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getLoginUser } from "@/lib/auth";

const prisma = new PrismaClient();

// 주소 수정(PUT)
export async function PUT(request, { params }) {
    try {
        const payload = await getLoginUser();
        if (!payload) {
        return NextResponse.json({
            success: false,
            message: '로그인 후 이용 가능합니다.',
        }, { status: 401 });
        }

        // 현재 로그인한 유저의 주소가 맞는지 확인
        const userId = payload.userId;

        const { addressId } = await params;
        if (!addressId) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 addressId가 없습니다.`);
            return NextResponse.json({ success: false, message: "addressId가 없음" }, { status: 404 });
        }

        const is_address = await prisma.address.findUnique({
            where: { id: Number(addressId) },
        });
        if (!is_address) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 수정 할 주소가 없습니다.`);
            return NextResponse.json({ success: false, message: "수정 할 주소 없음" }, { status: 404 });
        }
        
            const { name, recipient, phone, zipcode, address, detailAddress, isDefault } = await request.json();
            const UpdatedAddress = await prisma.address.update({
                where: { id: Number(addressId), userId: userId,  },
                data: {
                    name,
                    recipient,
                    phone,
                    zipcode,
                    address,
                    detailAddress,
                    isDefault,
                }
            });

        if (UpdatedAddress) {
        console.log(`[${new Date().toISOString()}] [INFO] ✅ 주소 수정 완료 - ${addressId}`);
        return NextResponse.json({ success: true, message: "주소 수정 완료", UpdatedAddress }, { status: 200 });
        } else {
        console.log(`[${new Date().toISOString()}] [WARN] 🚫 주소 수정 실패 - ${addressId}`);
        return NextResponse.json({ success: false, message: "주소 수정 실패" }, { status: 404 });
        }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 주소 수정 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `주소 수정 로직 실패: ${error}` }, { status: 500 });
      } finally {
        await prisma.$disconnect();
      }
}

// 주소 삭제(DELETE)
export async function DELETE(request, { params }) {
    try {
        const payload = await getLoginUser();
        if (!payload) {
        return NextResponse.json({
            success: false,
            message: '로그인 후 이용 가능합니다.',
        }, { status: 401 });
        }

        // 현재 로그인한 유저가 맞는지 확인
        const userId = payload.userId;

        const { addressId } = await params;
        if (!addressId) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 addressId가 없습니다.`);
            return NextResponse.json({ success: false, message: "addressId가 없음" }, { status: 404 });
        }

        const is_address = await prisma.address.findUnique({
            where: { id: Number(addressId) },
          });
        if (!is_address) {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 삭제 할 주소 정보가 없습니다.`);
            return NextResponse.json({ success: false, message: "삭제 할 주소 정보가 없습니다." }, { status: 404 });
        }

        const DeletedAddress = await prisma.address.delete({
            where: { id: Number(addressId), userId: userId },
          });

          if (DeletedAddress) {
            console.log(`[${new Date().toISOString()}] [INFO] ✅ 주소 삭제 완료 - ${addressId}`);
            return NextResponse.json({ success: true, message: "주소 삭제 완료", DeletedAddress }, { status: 200 });
          } else {
            console.log(`[${new Date().toISOString()}] [WARN] 🚫 주소 삭제 실패 - ${addressId}`);
            return NextResponse.json({ success: false, message: "주소 삭제 실패" }, { status: 404 });
          }

      } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 주소 삭제 로직 실패 ${error}`);
        return NextResponse.json({ success: false, message: `주소 삭제 로직 실패: ${error}` }, { status: 500 });
      }
}