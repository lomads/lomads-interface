import React,{useState,useEffect} from 'react';
import { get as _get} from 'lodash';
import CreatableSelect from 'react-select/creatable';
import { Box } from '@mui/material';

import { createDaoOption} from 'state/dashboard/actions'
import { resetCreateOptionLoader} from 'state/dashboard/reducer';
import { useAppDispatch,useAppSelector } from "state/hooks";

interface Option {
    label: string;
    value: string;
    color: string;
}

export default ({ loading, children, className,onChangeOption,defaultMenuIsOpen,menuPlacement, ...props }: any) => {
    const dispatch = useAppDispatch();
    const { DAO, createOptionLoading } = useAppSelector((state) => state.dashboard);
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState<Option | null>();

    useEffect(() => {
		if (createOptionLoading) {
            setIsLoading(false);
            onChangeOption(value);
			dispatch(resetCreateOptionLoader());
		}
	}, [createOptionLoading]);

    const createOption = (label: string) => ({
        label,
        value: label,
        color:'#FF69B4'
    });

    const handleCreate = (inputValue: string) => {
        setIsLoading(true);
        const newOption = createOption(inputValue);
        setValue(newOption);
        dispatch(createDaoOption({ url: DAO?.url, payload: {newOption} }))
    };

    const handleChange = (newValue:Option) => {
        setValue(newValue);
        onChangeOption(newValue);
    }

    const customStyles = {
        control: (base:any, state:any) => ({
          ...base,
          background: "#F5F5F5",
          border:'none',
          height:'40px',
        }),
      };

    return (
       <div>
            <CreatableSelect
                defaultMenuIsOpen={defaultMenuIsOpen}
                menuPlacement={menuPlacement}
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => handleChange(newValue!)}
                onCreateOption={handleCreate}
                options={_get(DAO,'options',[])}
                styles={customStyles}
                value={value}
            />
       </div>
    )
}
