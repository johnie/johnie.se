type LogoProps = {
  width: number;
  height: number;
  fill?: string;
};

const Logo = ({ width, height, fill }: LogoProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 795 792">
      <g clipPath="url(#clip0)">
        <path
          d="M513.637 225.968L513.089 7.13004C513.089 3.56502 510.346 0.548465 506.781 0C506.507 0 506.233 0 505.959 0H459.339C459.065 0 458.791 0 458.517 0C365.826 10.6951 291.51 83.0924 278.072 174.96C278.072 175.235 278.072 175.783 278.072 176.057V226.516V236.937L278.346 378.989V390.233L279.169 777.723V782.934C279.169 786.773 281.911 789.789 285.751 790.064C292.881 790.886 299.737 791.161 307.141 791.161C421.495 791.161 514.186 698.47 514.186 584.115H514.734L514.186 410.252L513.637 225.968Z"
          fill={fill}
        />
        <path
          d="M238.034 506.233C236.937 495.812 234.743 485.666 232.001 475.793C207.868 388.039 127.792 323.594 32.3595 323.594C24.4067 323.594 16.7282 324.143 9.04973 324.966C3.83932 325.514 -0.27417 330.176 -0.27417 335.386L0.548527 512.815H6.24955e-05V560.257V607.151C6.24955e-05 607.699 6.24955e-05 607.973 6.24955e-05 608.522C1.09699 618.943 3.29085 629.089 6.03318 638.962C30.1656 726.716 110.241 791.161 205.674 791.161C213.627 791.161 221.306 790.612 228.984 789.789C234.195 789.241 238.308 784.579 238.308 779.369L237.76 601.94H238.308V554.498V507.604C238.034 507.056 238.034 506.507 238.034 506.233Z"
          fill={fill}
        />
        <path
          d="M793.902 433.287C793.902 418.753 792.257 404.493 789.515 390.781C788.692 386.668 787.595 382.554 786.498 378.441C764.011 296.72 692.985 235.017 606.327 227.064C606.053 227.064 605.504 227.064 605.23 227.064H567.66C567.386 227.064 566.838 227.064 566.563 227.064H566.289C560.805 227.613 556.965 232.275 556.965 237.485V559.983V606.877C556.965 607.425 556.965 607.699 556.965 608.248C558.062 618.669 560.256 628.815 562.998 638.688C587.131 726.442 667.207 790.887 762.64 790.887C770.593 790.887 778.271 790.338 785.95 789.516C791.16 788.967 795.274 784.305 795.274 779.095L793.902 433.287Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="795" height="791.161" fill={fill} />
        </clipPath>
      </defs>
    </svg>
  );
};

Logo.defaultProps = {
  width: 40,
  height: 37,
  fill: '#fafaf9',
} as LogoProps;

export { Logo };
