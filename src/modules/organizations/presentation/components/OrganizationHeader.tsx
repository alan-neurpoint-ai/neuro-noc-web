import { BiBuilding } from 'react-icons/bi';

interface OrganizationHeaderProps {
  name: string;
  slug: string;
}

export const OrganizationHeader = ({ name, slug }: OrganizationHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #672da9 0%, #8b5cf6 100%)',
          boxShadow: '0 0 30px rgba(103, 45, 169, 0.6)',
        }}
      >
        <BiBuilding className="text-2xl text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-headline font-bold text-white">{name}</h1>
        <p className="text-sm text-white/40">{slug}</p>
      </div>
    </div>
  );
};
