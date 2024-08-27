import { Box, Button, ListItem, Paper, Select, styled, TableCell, TextField, Typography } from "@mui/material";

 export const StyledSelect = styled(Select)(({ theme }) => ({
    width: 100,
    height: 40,
    color: "black",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[300],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[400],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
  }));



  export const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.grey[300],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.grey[400],
      },
      '&.Mui-focused fieldset': {
        borderColor: "black",
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.grey[500],
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.grey[700], 
    },
  }));

  export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    // border: `1px solid ${theme.palette.divider}`,
    // '&:hover': {
    //   borderColor: "black",
    // },
  }));
  
  export  const AddressText = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(4),
  }));
  

  
 export const InputFieldButton = styled(Button)(({  }) => ({
    backgroundColor: '#220B65',
    fontWeight: 700,
    color:"white",
    '&:hover': {
      backgroundColor: '#220B65',
    },
  }));

  export const PaymentOption = styled(ListItem)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
  }));

  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1),
    fontWeight:700
  }));
  