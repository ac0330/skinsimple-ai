import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const CameraDarkContainer = styled(SafeAreaView).attrs({ edges: ['top', 'bottom'] })`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.scanBackground};
`;

export const CameraBackChevron = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  padding: 16px 24px 4px;
`;

export const ViewfinderWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const FrameBox = styled.View`
  width: 240px;
  height: 300px;
`;

const cornerBase = `
  position: absolute;
  width: 34px;
  height: 34px;
`;

export const CornerTopLeft = styled.View`
  ${cornerBase}
  top: 0;
  left: 0;
  border-top-width: 3px;
  border-left-width: 3px;
  border-color: ${({ theme }) => theme.colors.scanFrame};
  border-top-left-radius: 8px;
`;

export const CornerTopRight = styled.View`
  ${cornerBase}
  top: 0;
  right: 0;
  border-top-width: 3px;
  border-right-width: 3px;
  border-color: ${({ theme }) => theme.colors.scanFrame};
  border-top-right-radius: 8px;
`;

export const CornerBottomLeft = styled.View`
  ${cornerBase}
  bottom: 0;
  left: 0;
  border-bottom-width: 3px;
  border-left-width: 3px;
  border-color: ${({ theme }) => theme.colors.scanFrame};
  border-bottom-left-radius: 8px;
`;

export const CornerBottomRight = styled.View`
  ${cornerBase}
  bottom: 0;
  right: 0;
  border-bottom-width: 3px;
  border-right-width: 3px;
  border-color: ${({ theme }) => theme.colors.scanFrame};
  border-bottom-right-radius: 8px;
`;

export const CameraFooter = styled.View`
  padding: 0 48px 26px;
  gap: 16px;
  align-items: center;
`;

export const CameraHint = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.scanHint};
  text-align: center;
`;
