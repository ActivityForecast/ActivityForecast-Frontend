import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// clsx와 테일윈드를 동시에 사용할 때 코드 가독성과 충돌을 줄이기 위한 유틸
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
