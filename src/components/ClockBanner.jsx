import React, { useEffect, useState } from 'react';
import './ClockBanner.css';

const ClockBanner = () => {
    const [timeRemaining, setTimeRemaining] = useState({});

    useEffect(() => {
        const intervalId = setInterval(() => {
            const targetDate = new Date('2023-11-14');
            const currentDate = new Date();

            const differenceInTime = targetDate.getTime() - currentDate.getTime();

            const days = Math.floor(differenceInTime / (1000 * 3600 * 24));
            const hours = Math.floor((differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600));
            const minutes = Math.floor((differenceInTime % (1000 * 3600)) / (1000 * 60));
            const seconds = Math.floor((differenceInTime % (1000 * 60)) / 1000);

            setTimeRemaining({
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="clockBanner">
            <p>Countdown to Season 3:</p>
            <p>{timeRemaining.days} Days</p>
            <p>{timeRemaining.hours} Hours</p>
            <p>{timeRemaining.minutes} Minutes</p>
            <p>{timeRemaining.seconds} Seconds</p>
        </div>
    );
};

export default ClockBanner;
