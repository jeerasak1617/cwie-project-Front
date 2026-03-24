
import { Outlet } from 'react-router-dom';

const CompanyLayout = () => {
    return (
        <div className="w-full">
            <Outlet />
        </div>
    );
};

export default CompanyLayout;
