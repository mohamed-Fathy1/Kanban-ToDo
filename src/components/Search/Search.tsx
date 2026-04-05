import { InputAdornment, TextField } from "@mui/material"
import { SearchOutlined } from "@mui/icons-material"
import { useState } from "react"

function Search() {
    const [value, setValue] = useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    return (
        <TextField
            placeholder="Search tasks..."
            value={value}
            onChange={handleChange}
            sx={{
                width: 300,
                "& .MuiInputBase-root": {
                    borderColor: "divider",
                    backgroundColor: "#E8E9ED",
                },
                "& .MuiInputBase-input": {
                    fontWeight: 700,
                },
            }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start" sx={{ color: "text.secondary", fontWeight: 700 }}>
                            <SearchOutlined fontSize="small" />
                        </InputAdornment>
                    ),
                },
                htmlInput: {
                    sx: {
                        "&::placeholder": {
                            color: "text.secondary",
                            fontWeight: 700,
                            opacity: 1,
                        },
                    },
                },
            }}
        />
    )
}

export default Search
