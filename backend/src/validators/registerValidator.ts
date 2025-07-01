import { RegisterPayload } from '../interfaces/auth';

export function validateRegisterPayload(payload: RegisterPayload): string[] {
  const errors: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;

  function isValidDateString(dateStr: string): boolean {
    if (!birthdateRegex.test(dateStr)) return false;

    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(dateStr);

    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }

  if (!payload.email || !emailRegex.test(payload.email)) {
    errors.push("유효한 이메일 형식이 아닙니다.");
  }

  if (!payload.password || payload.password.length < 8) {
    errors.push("비밀번호는 8자 이상이어야 합니다.");
  }

  if (payload.password !== payload.pwVerify) {
    errors.push("비밀번호 확인이 일치하지 않습니다.");
  }

  if (!payload.nickname || payload.nickname.trim().length === 0) {
    errors.push("닉네임을 입력해주세요.");
  }

  if (!payload.address || payload.address.trim().length === 0) {
    errors.push("주소를 입력해주세요.");
  }

  if (
    !payload.birthdate ||
    typeof payload.birthdate !== "string" ||
    !isValidDateString(payload.birthdate)
  ) {
    errors.push("생년월일은 'YYYY-MM-DD' 형식의 올바른 날짜여야 합니다.");
  }

  // ✅ 부모 정보가 존재한다면 각 부모의 birthdate도 검사
  if (Array.isArray(payload.registeredParents)) {
    payload.registeredParents.forEach((parent, index) => {
      if (
        !parent.birthdate ||
        typeof parent.birthdate !== "string" ||
        !isValidDateString(parent.birthdate)
      ) {
        errors.push(
          `등록된 보호자 ${index + 1}의 생년월일은 'YYYY-MM-DD' 형식의 올바른 날짜여야 합니다.`
        );
      }
    });
  }

  return errors;
}
