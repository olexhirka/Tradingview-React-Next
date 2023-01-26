import { Divider, Sheet } from "@mui/joy";
import { Drawer, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { V2ChartConfig } from "../v2/chart-config";
import { useV2ChartConfigs } from "../v2/hooks/v2-data.hook";

import { Button, ButtonProps } from "@mui/joy";
import { V2ChartPresets } from "./chart-presets";
import { useV2MarketData } from "./hooks/v2-market-data.hook";
import { V2PeriodSelect } from "./period-select";
type Props = {} & ButtonProps;
export const ChartConfigButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick} variant="plain">
      Symbol List
    </Button>
  );
};

export const ChartConfigDrawer = () => {
  const [open, setOpen] = useState(false);
  const { configs } = useV2ChartConfigs();
  useV2MarketData(open);
  return (
    <Box>
      <Box position="absolute" right={0} top={0}>
        <Sheet variant="outlined">
          <Box p={1}>
            <ChartConfigButton onClick={() => setOpen(true)} />
          </Box>
        </Sheet>
      </Box>
      <Drawer
        open={open}
        anchor="right"
        onClose={() => {
          setOpen(false);
        }}
      >
        <Sheet sx={{ height: "100%" }}>
          <Stack divider={<Divider />} width={400} maxWidth="100vw" spacing={1}>
            <Stack
              px={2}
              pt={2}
              pb={1}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">Symbols</Typography>
              <V2PeriodSelect />
            </Stack>
            {configs.map((c) => (
              <V2ChartConfig key={c.name} config={c} />
            ))}
            <V2ChartPresets />
          </Stack>
        </Sheet>
      </Drawer>
    </Box>
  );
};
