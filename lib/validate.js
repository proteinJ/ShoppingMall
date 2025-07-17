// 유효성 검사

export function validateRegisterForm({ email, password, name, phone }) {
    if (!email || !password || !name || !phone) {
        return "모든 필드를 입력해주세요.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "이메일 형식이 올바르지 않습니다.";
    }
    if (password.length < 8) {
        return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (name.length < 1) {
        return "이름은 1자 이상이어야 합니다.";
    }
    if (phone.length > 11) {
        return "전화번호는 11자 이하이어야 합니다.";
    }

    // 이메일에서 @ 앞쪽 부분 추출
    const localPart = email.split('@')[0];

    // 같은 문자 개수 세기
    const sameCount = countSameCharacters(password, localPart);

    // 같은 문자가 4개 이상이면 유효성 검사 실패
    if (sameCount >= 4) {
        return "비밀번호는 아이디와 너무 유사할 수 없습니다.";
    }

    return null; // 통과 시 null 반환
}

// 정보수정: key, value 단위 검사
export function validateUpdateForm(key, value, newLoginId) {
    switch (key) {
        case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return "이메일 형식이 올바르지 않습니다.";
            break;
        case "password":
            if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
            // newLoginId가 undefined인 경우 처리
            if (newLoginId === undefined) return null;

            // 아이디와 비밀번호가 동일한 경우 유효성 검사 실패
            if (value.toLowerCase() === newLoginId.toLowerCase()) {
                return "비밀번호는 아이디와 동일할 수 없습니다.";
            }

            // 이메일에서 @ 앞쪽 부분 추출
            const localPart = newLoginId.split('@')[0];

            // 같은 문자 개수 세기
            const sameCount = countSameCharacters(value, localPart);

            // 같은 문자가 4개 이상이면 유효성 검사 실패
            if (sameCount >= 4) {
                return "비밀번호는 아이디와 너무 유사할 수 없습니다.";
            }

            break;

        case "user_name"||"adress_name":
            if (value.length < 1) return "이름은 1자 이상이어야 합니다.";
            break;
        
        case "adress":
            if (value.length < 3) return "주소지는 3자 이상이어야 합니다.";
            break;
        // 필요시 추가
    }
    return null;
}

function countSameCharacters(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    let count = 0;
    const minLength = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLength; i++) {
        if (str1[i] === str2[i]) {
            count++;
        }
    }

    return count;
}
