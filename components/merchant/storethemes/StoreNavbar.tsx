"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"

export default function StoreNavbar() {
  const params = useParams()
  const [storeName, setStoreName] = useState<string>("")

  useEffect(() => {
    const decodedStoreName = (params.store_name as string)?.replace(/%20/g, ' ') || ""
    setStoreName(decodedStoreName)
  }, [params.store_name])

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          fontFamily="fantasy"
          sx={{ color: "black" }}
          fontWeight={700}
        >
          {storeName}
        </Typography>
 
        <Box display="flex" gap={2}>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ color: "black" }}>
              Filters
            </Typography>
            <IconButton sx={{ color: "black" }} aria-label="filter">
              <TuneOutlinedIcon />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ color: "black" }}>
              Sort By
            </Typography>
            <IconButton sx={{ color: "black" }} aria-label="sort">
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}