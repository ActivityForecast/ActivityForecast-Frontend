import AutumnImg from 'assets/images/landing/autumn.svg';
import WinterImg from 'assets/images/landing/winter.svg';
import SummerImg from 'assets/images/landing/summer.svg';
import SpringImg from 'assets/images/landing/spring.svg';
import Feature1Img from 'assets/images/cloud.svg'; //임시 이미지
import Feature2Img from 'assets/images/sun.svg'; // Todo: 임시 이미지 후에 총 8개 이미지 넣어서 배분할 예정

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
      label: '위치와 날짜',
      description: '위치와 날짜를 선택해주세요.',
    },
    feature2: {
      image: Feature2Img,
      label: '활동 추천',
      description: '날씨에 맞는 활동을 추천해줘요.',
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
      image: Feature1Img,
      label: '크루 서비스',
      description: '크루와 함께 활동을 즐길 수 있어요.',
    },
    feature2: {
      image: Feature2Img,
      label: '공동 일정 관리',
      description: '크루 일정을 생성하고 관리해봐요.',
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
      image: Feature1Img,
      label: '히스토리 페이지',
      description: '활동했던 기록을 확인할 수 있어요.',
    },
    feature2: {
      image: Feature2Img,
      label: '평점 관리',
      description: '활동 추천 만족도에 대한 평점을 입력해주세요.',
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
      image: Feature1Img,
      label: '선호 활동 설정',
      description: '마이페이지에서 선호하는 활동을 선택할 수 있어요.',
    },
    feature2: {
      image: Feature2Img,
      label: '도움말 확인',
      description: '도움말에는 활동예보에 대한 간단한 질의가 담겨있어요. ',
    },
  },
];
