import { useRouter } from "next/router";
import { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

interface HeaderProps {
  showBackArrow?: boolean;
  label: string;
}

const Header: React.FC<HeaderProps> = ({showBackArrow, label }) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="border-b-[1px] border-neutral-800 pt-5 pl-5">
      <div className="flex flex-row items-center gap-2">
        {showBackArrow && (
          <BiArrowBack 
            onClick={handleBack} 
            color="white" 
            size={20} 
            className="
              cursor-pointer 
              hover:opacity-70 
              transition
          "/>
        )}
        <h1 className="text-white text-xl font-semibold">
          {label}
        </h1>
      </div>
      <div className="flex flex-row items-center justify-around mt-6">
        <div className="relative p-3">
          <span className="text-white font-bold">For you</span>
          <div className="w-14 absolute h-1 min-w-fit bg-blue-500 self-center inline-flex bottom-0 left-3"></div>
        </div>
        <div>
        <span className="text-white font-bold">Following</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
