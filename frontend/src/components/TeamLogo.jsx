import React, { useState } from 'react';
import { getTeamAsset } from '../utils/teamConstants';
import './TeamLogo.css';

const TeamLogo = ({ teamName, size = 'medium', className = '' }) => {
    const [hasError, setHasError] = useState(false);
    const { logo, color } = getTeamAsset(teamName);

    const handleError = () => {
        setHasError(true);
    };

    const cssClasses = `team-logo team-logo-${size} ${className}`;

    if (logo && !hasError) {
        return (
            <img
                src={logo}
                alt={`${teamName} logo`}
                className={cssClasses}
                onError={handleError}
            />
        );
    }

    // Fallback: initial letter badge with team color
    const fallbackLetter = teamName ? teamName.charAt(0).toUpperCase() : '?';

    return (
        <div
            className={`${cssClasses} fallback-logo`}
            style={{
                background: `linear-gradient(135deg, ${color} 0%, #333 150%)`,
            }}
        >
            {fallbackLetter}
        </div>
    );
};

export default TeamLogo;
