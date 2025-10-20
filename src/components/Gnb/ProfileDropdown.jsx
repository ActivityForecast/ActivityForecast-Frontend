import Dropdown from 'components/Dropdown/Dropdown';
import DropdownButton from 'components/Dropdown/DropdownButton';
import DropdownMenu from 'components/Dropdown/DropdownMenu';
import DropdownMenuItem from 'components/Dropdown/DropdownMenuItem';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg';

function ProfileDropdown() {
  const navigate = useNavigate();
  return (
    <Dropdown>
      <DropdownButton className="px-3 py-2 rounded-lg hover:bg-gray-100">
        김활동
      </DropdownButton>
      <DropdownMenu className="w-[120px]">
        <DropdownMenuItem
          className="text-center"
          onClick={() => navigate('/mypage')}
        >
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center text-[#ef4444] justify-center"
          onClick={() => alert('로그아웃 버튼을 눌렀습니다.')}
        >
          <LogoutIcon />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default ProfileDropdown;
