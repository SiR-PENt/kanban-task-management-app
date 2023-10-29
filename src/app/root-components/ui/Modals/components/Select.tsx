import React, { useState } from 'react';
import Select from 'react-select';
import { GroupBase, Props, ActionMeta } from 'react-select';


const customStyles = {
    control: (styles, { isFocused }) => ({
        ...styles,
        border: isFocused ? "1px solid #828FA3" : "1px solid #635fc7",
        borderRadius: "0.5rem",
        boxShadow: "none",
        backgroundColor: '#2B2C37',
        ":hover": {
          borderColor: "#828fa3",
        },
      }),
}

export default function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>>
  (props: Props<Option, IsMulti, Group>) {
  return (
    <Select {...props} styles={customStyles} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}
  
  