import styled from "styled-components";

interface IAvatar {
  size?: number;
}
export const Avatar = styled.img<IAvatar>`
  width: ${p => (p.size ? p.size : 45)}px;
  height: ${p => (p.size ? p.size : 45)}px;
  min-width: ${p => (p.size ? p.size : 45)}px;
  border-radius: 50px;
  margin-right: ${p => p.theme.space.medium}px;
`;

export default Avatar;
