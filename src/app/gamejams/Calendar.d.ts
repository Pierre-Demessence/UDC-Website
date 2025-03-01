import { FC } from 'react';

type GameJam = {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    itchIoUrl: string;
};

type CalendarProps = {
    jams: GameJam[];
};

declare const Calendar: FC<CalendarProps>;
export default Calendar;