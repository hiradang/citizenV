import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Footer from '../footer/footer';
import './styles.scss';
import Image1 from '../../constants/images/slides/Image1.png';
import Image2 from '../../constants/images/slides/Image2.png';
import Image3 from '../../constants/images/slides/Image3.png';
import Image4 from '../../constants/images/slides/Image4.png';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const label = 'Các sự kiện đang diễn ra ';

const images = [
  {
    label: label,
    imgPath: Image1,
  },
  {
    label: label,
    imgPath: Image2,
  },
  {
    label: label,
    imgPath: Image3,
  },
  {
    label: label,
    imgPath: Image4,
  },
];

function Slide() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div className="grid">
      <div className="row">
        <div className="col l-12 c-12 m-12">
          <div className="container-slide">
            <div className="row">
              <div className="col l-12 m-12 c-12">
                <h2>Hệ thống điều tra dân số CitizenV</h2>
              </div>
            </div>
            <div className="row">
              <div className="col l-10 l-o-1 m-10 m-o-1 c-12">
                <Paper
                  className="title-slide"
                  square
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    pl: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <h3 className="content-slide">{images[activeStep].label}</h3>
                </Paper>
                <AutoPlaySwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={activeStep}
                  onChangeIndex={handleStepChange}
                  enableMouseEvents
                >
                  {images.map((step, index) => (
                    <div key={step.label}>
                      {Math.abs(activeStep - index) <= 2 ? (
                        <Box
                          component="img"
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            width: '100%',
                          }}
                          src={step.imgPath}
                          alt={step.label}
                        />
                      ) : null}
                    </div>
                  ))}
                </AutoPlaySwipeableViews>
                <MobileStepper
                  className="footer-slide"
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === maxSteps - 1}
                    >
                      Next
                      {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                  }
                  backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                      {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                      Back
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col l-12 m-12 c-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Slide;
