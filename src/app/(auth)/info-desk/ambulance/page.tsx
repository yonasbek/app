'use client';

import AmbulanceServiceReports from '../../../../components/info-desk/AmbulanceServiceReports';

export default function AmbulancePage() {

    return (
        <div className="min-h-screen bg-app-background">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AmbulanceServiceReports
                    onViewDetails={(service) => {
                        // Handle view details
                        console.log('View details:', service);
                    }}
                    onEdit={(service) => {
                        // Handle edit
                        console.log('Edit:', service);
                    }}
                    onDelete={(service) => {
                        // Handle delete
                        console.log('Delete:', service);
                    }}
                    onCreate={() => {
                        // Handle create
                        console.log('Create new service');
                    }}
                />
            </div>
        </div>
    );
}