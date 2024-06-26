import { useEffect, useState } from "react";
import { getSliderImg } from "@/api/user";
import refreshIcon from "@/assets/icon/refresh.svg";
import closeIcon from "@/assets/icon/close.svg";
import "./slider.css";
const Slider = ({ onValid, onClose }) => {
  const [imageData, setImageData] = useState({
    backgroundImg: "",
    sliderImg: "",
    uuid: ""
  });
  const uuid = imageData.uuid;
  const [isStartMove, setStartMove] = useState(false);
  const [startX, setStartX] = useState(0);
  const [moveX, setMoveX] = useState(0);
  const [movePercent, setMovePercent] = useState(0);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function getImg() {
      const {
        data: { data }
      } = await getSliderImg();
      if (!ignore) {
        setImageData({
          backgroundImg: data.captcha.backgroundImage,
          sliderImg: data.captcha.sliderImage,
          uuid: data.id
        });
      }
    }
    getImg();
    return () => {
      ignore = true;
    };
  }, [reload]);

  useEffect(() => {
    // 鼠标开始移动
    const onMove = (e) => {
      if (!isStartMove) return;
      const moveX = e.pageX - startX;
      setMoveX(Math.min(370, Math.max(0, moveX)));
      setMovePercent(Math.max(0, moveX / 370));
    };

    // 鼠标停止移动
    const onStop = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onStop);
      if (!isStartMove) return;
      setStartMove(false);
      validImg();
    };
    // 校验滑块
    async function validImg() {
      const result = await onValid(movePercent, uuid);
      if (!result) {
        setReload(!reload);
        setStartMove(false);
        setMoveX(0);
        setMovePercent(0);
      }
    }
    if (isStartMove) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onStop);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onStop);
    };
  }, [isStartMove, moveX, movePercent, startX, uuid, onValid]);

  // 点击滑块
  const startMove = (e) => {
    setStartMove(true);
    setStartX(e.pageX);
  };

  // 刷新滑块数据
  const onReset = () => {
    setReload(!reload);
  };

  return (
    <div className="slider">
      <div className="mask">
        <div className="container">
          <div className="img">
            <div className="background-img">
              <img src={imageData.backgroundImg}></img>
            </div>
            <div className="move-img" style={{ left: `${moveX}px` }}>
              <img className="inner-mv-img" src={imageData.sliderImg}></img>
            </div>
          </div>
          <div className="slide">
            <div className="slider-mask" style={{ width: `${moveX + 20}px` }}>
              <div className="block" style={{ left: `${moveX}px` }} onMouseDown={startMove}>
                <span className="yidun_slider_icon"></span>
              </div>
            </div>
          </div>
          <div className="button-group">
            <img
              style={{ height: "22px", width: "21px", marginRight: "8px" }}
              src={refreshIcon}
              onClick={onReset}
            />
            <img src={closeIcon} onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Slider;
