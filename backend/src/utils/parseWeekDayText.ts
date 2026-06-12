export default function ParseWeekDayText(weekDayText:string[]){
    return weekDayText.map((entry:string)=>{
        const [day,hours]=entry.split(": ");
        const [opening,closing]=hours?.split(" – ") ?? ["N/A","N/A"];

        return {
            day,
            opening,
            closing
        }
    })
}