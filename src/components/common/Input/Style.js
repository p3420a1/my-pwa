import styled from "styled-components";

export const InputDiv = styled.div`
	display: flex;
	width: 100%;
	margin-bottom: 15px;
	background: ${({ isShowIcon }) => (isShowIcon ? "#e9e9e9" : "#232223")};
	height: 45px;
	border: 2px solid;
	border-color: ${({ isError, isShowIcon }) =>
		isError ? "red" : isShowIcon ? "#e9e9e9" : "#424242"} !important;
	display: flex;
	justify-content: center;
	align-items: center;
	.vl {
		border-right: 1.2px solid #ff5900;
		height: 25px;
	}
	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		width: 61px;
		& img {
			height: 14px;
			width: 18px;
		}
	}
	.icon:after {
		height: 50%;
	}
	& input {
		width: 98%;
		padding: 10px;
		outline: none !important;
		background: ${({ isShowIcon }) => (isShowIcon ? "#e9e9e9" : "#232223")};
		border-radius: ${({ isShowIcon }) => (isShowIcon ? "50px" : "none")};
		border: none;
		color: ${({ isShowIcon }) => (isShowIcon ? "black" : "#969696")};
		height: ${({ isError, isShowIcon }) =>
			isError ? "42px" : isShowIcon ? "45px" : "42px"} !important;
	}
	& input::-ms-input-placeholder {
		color: ${({ isShowIcon }) => (isShowIcon ? "black" : "#757575")};
		font-size: 14px;
	}
	& input:-ms-input-placeholder {
		color: ${({ isShowIcon }) => (isShowIcon ? "black" : "#757575")};
		font-size: 14px;
	}
	& input::placeholder {
		color: ${({ isShowIcon }) => (isShowIcon ? "black" : "#757575")};
		font-size: 14px;
	}
	& .error {
		color: red;
	}
`;
