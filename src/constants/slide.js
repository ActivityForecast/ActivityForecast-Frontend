import AutumnImg from 'assets/images/landing/autumn.svg';
import WinterImg from 'assets/images/landing/winter.svg';
import SummerImg from 'assets/images/landing/summer.svg';
import SpringImg from 'assets/images/landing/spring.svg';
import Feature1Img from 'assets/images/landing/선호활동.png';
import Feature2Img from 'assets/images/landing/날짜와위치.png';
import Feature3Img from 'assets/images/landing/메인활동.png';
import Feature4Img from 'assets/images/landing/상세활동.png';
import Feature5Img from 'assets/images/landing/크루.png';
import Feature6Img from 'assets/images/landing/크루일정.png';
import Feature7Img from 'assets/images/landing/히스토리.png';
import Feature8Img from 'assets/images/landing/활동평점.png';

export const SLIDES = [
  {
    id: 'spring',
    heroImage: SpringImg,
    bgClass: 'bg-[#FFC0D9]',
    accentClass: 'bg-[#FFDBEC]',
    title: '날씨와 활동을 잇는\n나만의 활동 서비스',
    subtitle: '기분 좋은 날씨에 가볍게 나가기 좋은 날.',
    feature1: {
      image: Feature1Img,
      label: '선호활동 설정',
      description: '회원가입, 마이페이지에서 선호활동을 설정해주세요.',
    },
    feature2: {
      image: Feature2Img,
      label: '날짜와 위치',
      description: '이후 날짜와 위치를 선택하면 활동을 추천해줍니다!',
    },
  },
  {
    id: 'summer',
    heroImage: SummerImg,
    bgClass: 'bg-[#00B5FF]',
    accentClass: 'bg-[#4FD2FF]',
    title: '날씨와 활동을 잇는\n나만의 활동 서비스',
    subtitle: '뜨거운 햇살 아래, 컨디션에 맞는 활동 선택.',
    feature1: {
      image: Feature3Img,
      label: '활동 추천',
      description: '사용자의 선호 활동과 날씨를 기준으로 활동을 추천해줘요.',
    },
    feature2: {
      image: Feature4Img,
      label: '활동 상세',
      description: '원하는 활동의 상세 정보를 확인해봐요.',
    },
  },
  {
    id: 'autumn',
    heroImage: AutumnImg,
    bgClass: 'bg-[#FF9A3D]',
    accentClass: 'bg-[#FFB35F]',
    title: '날씨와 활동을 잇는\n나만의 활동 서비스',
    subtitle: '선선한 계절, 오늘 할 수 있는 활동을 한눈에.',
    feature1: {
      image: Feature5Img,
      label: '크루 서비스',
      description: '크루원들과 함께 활동을 즐길 수 있어요.',
    },
    feature2: {
      image: Feature6Img,
      label: '공동 일정 관리',
      description: '크루 일정을 생성하고 관리해봐요.',
    },
  },
  {
    id: 'winter',
    heroImage: WinterImg,
    bgClass: 'bg-[#8AD7FF]',
    accentClass: 'bg-[#C4ECFF]',
    title: '날씨와 활동을 잇는\n나만의 활동 서비스',
    subtitle: '추운 날씨에도 안전하게 즐길 수 있는 활동.',
    feature1: {
      image: Feature7Img,
      label: '히스토리 페이지',
      description: '활동했던 기록을 확인할 수 있어요.',
    },
    feature2: {
      image: Feature8Img,
      label: '평점 관리',
      description: '활동 추천 만족도에 대한 평점을 입력해주세요.',
    },
  },
];
