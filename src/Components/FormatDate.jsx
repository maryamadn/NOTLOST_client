import format from "date-fns/format";

const FormatDate = ({date}) => {

    const formattedDate = format(new Date(date), "dd-MM-yyyy hh:mm aaa")

    return formattedDate
}

export default FormatDate