import { STEP_PATH } from "constants/enum";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateStepNumber } from "state/proposal/reducer";

const useStepRouter = (currentStep: number) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const prevStepNumber = parseInt(localStorage.getItem('stepNumber') ?? '1');
        const maxStep = parseInt(localStorage.getItem('maxStep') ?? '0');

        if (currentStep <= maxStep) {
            dispatch(updateStepNumber(currentStep))
        } else {
            navigate(STEP_PATH[prevStepNumber]);
        }
    }, [])
};

export default useStepRouter;
