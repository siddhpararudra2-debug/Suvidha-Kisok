import { Box, Typography, Tooltip, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ElectricBolt, LocalGasStation, WaterDrop } from '@mui/icons-material';
import { RootState } from '../../store';

const LiveStatusBar = () => {
    const { t } = useTranslation();
    const { liveStatus } = useSelector((state: RootState) => state.services);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
            case 'normal':
                return 'success';
            case 'warning':
            case 'limited':
                return 'warning';
            case 'critical':
            case 'disrupted':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 1,
                backgroundColor: 'neutral.50',
                borderRadius: 2,
            }}
        >
            {/* Electricity Status */}
            <Tooltip title={`Grid Load: ${liveStatus.electricity.gridLoad}%`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ElectricBolt
                        sx={{
                            color: getStatusColor(liveStatus.electricity.gridStatus) + '.main',
                            fontSize: 20,
                        }}
                    />
                    <Box
                        className="status-indicator"
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: getStatusColor(liveStatus.electricity.gridStatus) + '.main',
                        }}
                    />
                </Box>
            </Tooltip>

            {/* Gas Prices */}
            <Tooltip title={`PNG: ₹${liveStatus.gas.pngPrice}/SCM | CNG: ₹${liveStatus.gas.cngPrice}/kg`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalGasStation sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        ₹{liveStatus.gas.cngPrice}
                    </Typography>
                </Box>
            </Tooltip>

            {/* Water Status */}
            <Tooltip title={t(`liveStatus.${liveStatus.water.supplyStatus}`)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WaterDrop
                        sx={{
                            color: getStatusColor(liveStatus.water.supplyStatus) + '.main',
                            fontSize: 20,
                        }}
                    />
                    <Chip
                        label={t(`liveStatus.${liveStatus.water.supplyStatus}`)}
                        size="small"
                        color={getStatusColor(liveStatus.water.supplyStatus) as 'success' | 'warning' | 'error'}
                        sx={{ height: 24, fontSize: 11 }}
                    />
                </Box>
            </Tooltip>
        </Box>
    );
};

export default LiveStatusBar;
