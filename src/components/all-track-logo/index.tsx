import AllTrackLogoIcon from "./icon";
import AllTrackLogoText from "./text";

type AllTrackLogoProps = {
    collapsed?: boolean;
};

//! Probably we need to move into Redux state management - `collapsed = false`
const AllTrackLogo = ({ collapsed = false }: AllTrackLogoProps) => {
    return (
        <>
            <AllTrackLogoIcon />
            <AllTrackLogoText collapsed={collapsed} />
        </>
    )
}

export default AllTrackLogo