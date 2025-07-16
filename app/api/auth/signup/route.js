// 사용자 회원가입
import { registerUser } from "@/lib/register";

export async function POST(request) {
    const { email, password, name, phone } = await request.json();
    return await registerUser({ email, password, name, phone });
}