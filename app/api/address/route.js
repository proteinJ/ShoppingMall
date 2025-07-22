// 주소 추가(POST), 목록(GET)
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getLoginUser } from '@/lib/auth';



// 주소 등록(POST)
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

    // 현재 로그인한 유저가 맞는지 확인
    const userId = payload.userId;

    const { name, recipient, phone, zipcode, address, detailAddress, isDefault } = await request.json();

    const is_SameName = await prisma.address.findFirst({
        where: { name }
    });
    if (is_SameName) {
        console.log(`[${new Date().toISOString()}] [WARN] ❌ 같은 이름의 주소가 있음`);
        return NextResponse.json({ success: false, message: `같은 이름의 주소가 있음` }, { status: 409 });
    }

    const newAddress = await prisma.address.create({
        data: {
            name,
            recipient,
            phone,
            zipcode,
            address,
            detailAddress,
            isDefault,
            user: {
                connect: { id: userId } // userId로 연결
              }
        },
    });

      console.log(`[${new Date().toISOString()}] [INFO] ✅ 주소 등록 완료`);
      return NextResponse.json({ success: true, message: `주소 등록 완료`, newAddress }, { status: 200 });
  } catch (error) {
    console.log(`[${new Date().toISOString()}] [ERROR] ❌ 주소 등록 로직 실패 ${error}`);
    return NextResponse.json({ success: false, message: `주소 등록 로직 실패: ${error}` }, { status: 500 });
  }
}

// 주소 목록 조회(GET)
export async function GET(request) {
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

        // 주소 목록 조회 
        const addresses = await prisma.address.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                recipient: true,
                phone: true,
                zipcode: true,
                address: true,
                detailAddress: true,
                isDefault: true,
                }
            });

        if (addresses) {
          console.log(`[${new Date().toISOString()}] [INFO] ✅ 주소 목록 조회 완료`);
          return NextResponse.json({ success: true, addresses }, { status: 200 });
        } else {
          console.log(`[${new Date().toISOString()}] [WARN] 🚫 주소 목록 정보 없음`);
          return NextResponse.json({ success: true, message: "주소 목록 정보 없음" }, { status: 404 });
        }
          
    } catch (error) {
        console.log(`[${new Date().toISOString()}] [ERROR] ❌ 주소 목록 조회 로직 실패 - error ${error}`);
        return NextResponse.json({ success: false, message: "주소 목록 조회 로직 실패" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}