// src/pages/ManagerProfile.tsx
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import SoftSection from "@/components/SoftSection";

const ManagerProfile: React.FC = () => {
  const { id } = useParams();

  // 하드코딩된 매니저 데이터
  const profiles: Record<string, any> = {
    "1": {
      name: "이선희 동행매니저",
     location: "서울 동대문구 장안동",
      score: 100,
      level: "Pro 매니저",
      intro:
        "안녕하세요, 따뜻한 마음으로 어르신 곁을 지켜드리고 싶은 동행매니저 이선희입니다. 환한 웃음으로 어르신이 행복하고 안전한 외출을 하실 수 있도록 최선을 다하겠습니다.",
      reason:
        "아버지를 10년 넘게 직접 모시면서 병원 진료, 약 수령 등 생활을 함께 해왔습니다. 그러면서 어르신들에게는 단순히 일을 대신해주는 것보다, 곁에서 안심할 수 있게 함께해주는 존재가 필요하다는 것을 깊이 깨달았습니다. 이런 경험을 바탕으로 다른 어르신들에게도 믿음직한 동반자가 되고 싶어 동행매니저로 활동하게 되었습니다.",
      strength:
        "긍정적이고 밝은 성격 덕분에 처음 만난 뵙는 어르신들과도 금세 친해질 수 있습니다. 낯선 누군가가 아닌 진정성있게 일상을 함께하는 동반자로 다가갈 수 있도록 언제나 노력하겠습니다.",
      cert: "동행매니저 전문가 교육 수료",
      academy: "May Caregiver Academy",
    },
    "2": {
      name: "박정숙 동행매니저",
      location: "서울 성북구 안암동",
      score: 100,
      level: "Pro 매니저",
      intro:
        "안녕하세요, 어르신의 하루에 힘을 보태고 싶은 동행매니저 박정숙입니다. 제 부모님을 모신다는 마음으로, 따듯하게 다가가 어르신의 하루에 안정감을 드리고 싶습니다.",
      reason:
        "아이들을 다 키운 뒤 홀로 계신 어르신들을 위해 봉사활동을 하며 종종 함께 외출을 해왔습니다. 낯선 환경에서 혼자 계실 때 보이는 불안한 표정들을 보며, 신뢰할 수 있는 동반자가 얼마나 필요한지 깨달았습니다. 그때의 마음이 계기가 되어 지금은 동행매니저로서 어르신 곁을 지키고 있습니다.",
      strength:
        "차분하고 배려심 깊은 성격으로, 어르신이 편안한 마음을 여실 수 있도록 대화를 이끌어갑니다. 또한 꼼꼼한 성격으로 병원 서류나 장을 보실 때도 세심하게 챙겨드릴 수 있습니다.",
      cert: "동행매니저 전문가 교육 수료",
      academy: "May Caregiver Academy",
    },
  };

  const profile = profiles[id ?? "1"];
  const avatarSrc =
    id === "2" ? "/assets/img/profile_2.png" : "/assets/img/profile_1.png";
  const certSrc = `/assets/img/cert_${id ?? "1"}.png`; // /assets/img/cert_1.png, cert_2.png 형태
  return (
    <MainLayout
      headerProps={{ title: "동행매니저 프로필", type: "header-a" }}
      contentClassName="!px-0 !py-0 !gap-0"
      showNav={false}
    >
      <div className="flex flex-col items-center w-full">
        {/* 상단 배경 + 프로필 이미지 */}
        <div className="w-full h-38 bg-gradient-to-r from-yellow-100 to-[#F7B349] flex justify-center items-end">
          <img
            src={avatarSrc}
            alt={`${profile.name} 프로필 이미지`}
            className="w-36 h-36 rounded-full object-cover  shadow-sm -mb-14"
          />
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-[1.5rem] font-medium pb-2">{profile.name}</h2>
          <p className="text-gray-500">{profile.location}</p>

          {/* 점수 / 레벨 */}
          <div className="flex justify-center gap-8 mt-8 mb-6">
            <div className="flex flex-col items-center">
               <img
      src="/assets/img/pro_label.png"
      alt="Pro 인증 라벨"
      className="h-6 w-auto object-contain"
    />
    <span className="text-sm mt-2">프로 매니저</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.score}점</span>
              <span className="text-sm mt-1">이용 만족도</span>
            </div>
          </div>
        </div>

        {/* 섹션 구분선 */}
        <SoftSection />

        {/* 소개 */}
        <SoftSection>
          <section className="mt-8 w-full">
            <h3 className="font-semibold text-[1.25rem] mb-2">자기소개</h3>
            <p className="text-gray-700">{profile.intro}</p>
          </section>

          {/* 활동 계기 */}
          <section className="mt-6 w-full">
            <h3 className="font-medium text-lg mb-2">○ 동행매니저 활동 계기</h3>
            <p className="text-gray-700">{profile.reason}</p>
          </section>

          {/* 강점 */}
          <section className="mt-6 mb-8 w-full">
            <h3 className="font-medium text-lg mb-2">○ 매니저님만의 강점</h3>
            <p className="text-gray-700">{profile.strength}</p>
          </section>
        </SoftSection>

        <SoftSection className="mt-6 px-6 w-full" divider={false}>
  <h3 className="font-bold text-lg mb-2">경력, 자격</h3>
  <div className="p-4 flex items-center gap-6">
    {/* 자격증 이미지 */}
    <div className="w-[180px] h-[120px] bg-gray-50 flex items-center justify-center shrink-0 rounded-sm ring-1 ring-gray-200 overflow-hidden">
      <img
        src={certSrc}
        alt="자격증 이미지"
        className="w-full h-full object-contain"
        onError={(e) => {
          // 파일명이 다를 때 기본 이미지로 폴백
          (e.currentTarget as HTMLImageElement).src = "/assets/img/certificate.png";
        }}
      />
    </div>

    {/* 텍스트 정보 */}
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{profile.cert}</p>
      <p className="text-gray-500 text-base">{profile.academy}</p>
    </div>
  </div>
</SoftSection>
{/* 섹션 구분선 */}
        <SoftSection />
        <p className="mt-10 mb-6 text-center text-sm text-gray-500">
          안심할 수 있는 동행을 찾고 있나요? <br />
          검증된 매니저와 함께하는 메이를 경험해보세요!
        </p>
      </div>
    </MainLayout>
  );
};

export default ManagerProfile;
 