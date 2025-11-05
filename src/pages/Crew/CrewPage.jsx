import { useState } from "react";
import Button from "components/Button";
import CalendarBox from "mocks/Calender";
import CrewListItem from "mocks/CrewListItem";
import Modal, { ModalFooter } from "components/Modal/Modal";
import InputField from "components/InputField";

export default function CrewPage() {

  //  파스텔톤 색상 팔레트
  const colorPalette = [
    "#FC8385",
    "#FCA883",
    "#FCD083",
    "#A4E682",
    "#7FECC8",
    "#83C8FC",
    "#A6A4FC",
    "#E6A4FC",
    "#FC83C6",
    "#FCE683",
  ];

  const [crews, setCrews] = useState([
    { id: 1, name: "농구하조", current: 3, max: 5, color: "#FC8385" },
    { id: 2, name: "활동하조", current: 3, max: 5, color: "#83C8FC" },
  ]);
  const [usedColors, setUsedColors] = useState(["#FC8385", "#83C8FC"]);

  //  생성 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crewName, setCrewName] = useState("");
  const [crewMax, setCrewMax] = useState("");

  //  탈퇴 완료 모달
  const [leaveTargetId, setLeaveTargetId] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  // 예시 크루 일정 데이터
  const crewEvents = {
    1: [
      { date: "2025-11-04", label: "런닝" },
      { date: "2025-11-12", label: "축구" },
    ],
    2: [
      { date: "2025-11-07", label: "배구" },
      { date: "2025-11-20", label: "등산" },
    ],
  };

  // 랜덤 색상 선택 (중복 방지)
  const getRandomColor = () => {
    const availableColors = colorPalette.filter((c) => !usedColors.includes(c));
    if (availableColors.length === 0) {
      setUsedColors([]);
      return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }
    const randomColor =
      availableColors[Math.floor(Math.random() * availableColors.length)];
    setUsedColors([...usedColors, randomColor]);
    return randomColor;
  };

  // 크루 생성 로직
  const handleCreateCrew = () => {
    if (!crewName.trim() || !crewMax.trim()) return;

    const newCrew = {
      id: Date.now(),
      name: crewName,
      current: 1,
      max: parseInt(crewMax, 10),
      color: getRandomColor(),
    };

    setCrews((prev) => [...prev, newCrew]);
    setCrewName("");
    setCrewMax("");
    setIsModalOpen(false);
  };

  // CrewListItem에서 탈퇴 클릭 시 → 완료 모달 띄우기
  const handleLeaveRequest = (id) => {
    setLeaveTargetId(id);
    setLeaveModalOpen(true);
  };

  //  완료 클릭 시 실제 삭제
  const handleLeaveConfirm = () => {
    if (leaveTargetId == null) return;
    setCrews((prev) => prev.filter((c) => c.id !== leaveTargetId));
    setLeaveTargetId(null);
    setLeaveModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center relative">
      <div
        className="
          w-[90vw] max-w-[952px]
          min-h-[90vh]
          border border-[rgba(0,0,0,0.09)]
          rounded-[30px]
          bg-[#F8FAFC]
          shadow-sm
          flex flex-col items-center
          justify-start
          pt-12 px-10 pb-10
          overflow-hidden
        "
      >
        {/*  상단 버튼 */}
        <div className="w-full flex justify-center">
          <Button
            type="button"
            styleType="solid"
            size="py-3.5 w-[200px] text-md"
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[50px] shadow-md transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            크루 생성 +
          </Button>
        </div>

        {/* 크루 목록 */}
        <h2 className="w-full text-2xl font-semibold text-black mt-20 text-left ml-10 md:ml-20 lg:ml-40">
          크루목록
        </h2>

        <div className="w-full mt-4 px-6">
          <div className="space-y-3">
            {crews.map((c) => (
              <CrewListItem
                key={c.id}
                id={c.id}
                name={c.name}
                current={c.current}
                max={c.max}
                color={c.color}
                events={crewEvents[c.id] || []}
                onLeave={handleLeaveRequest}   //  탈퇴 요청 핸들러
              />
            ))}
          </div>
        </div>

        {/* 캘린더 */}
        <h3 className="w-full text-2xl font-semibold text-black mt-10 text-center">
          캘린더
        </h3>
        <div className="mt-6 flex justify-center">
          {/* 이 캘린더만 X축 더 넓게 */}
          <CalendarBox inline size="xl" wide />
        </div>
      </div>

      {/* 모달 (크루 생성) - 가로폭 작게 */}
      <div style={{ '--modal-w-sm': '640px' }}>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="크루 생성하기"
      >
        <div className="flex flex-col gap-4 mt-4">
          <label className="font-semibold text-lg text-black">크루명</label>
          <InputField
            id="crewName"
            type="text"
            placeholder="크루명을 입력하세요"
            value={crewName}
            onChange={(e) => setCrewName(e.target.value)}
          />

          <label className="font-semibold text-lg text-black mt-2">인원</label>
          <InputField
            id="crewMax"
            type="number"
            placeholder="인원을 정해주세요"
            value={crewMax}
            onChange={(e) => setCrewMax(e.target.value)}
          />

          <ModalFooter>
            <Button
              type="button"
              styleType="solid"
              onClick={handleCreateCrew}
              className="bg-[#3B82F6] text-white rounded-xl mt-4"
            >
              생성하기
            </Button>
          </ModalFooter>
        </div>
      </Modal>
      </div>

      {/*  탈퇴 완료 모달 - 더 작게 */}
      <div style={{ '--modal-w-sm': '520px' }}>
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        hasCloseButton={false}
        isCloseOutsideClick={true}
        title=""
      >
        <div className="text-center text-lg font-semibold py-6">
          탈퇴가 완료되었습니다
        </div>
        <ModalFooter>
          <button
            onClick={handleLeaveConfirm}
            className="flex-1 rounded-xl bg-[#4FBFF2] text-white py-3"
          >
            완료
          </button>
        </ModalFooter>
      </Modal>
      </div>
    </main>
  );
}
