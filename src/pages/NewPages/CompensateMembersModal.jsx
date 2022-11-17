import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input,
  FormControl,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,Select } from "@chakra-ui/react";
import { ReactComponent as CompensateIcon } from "../../assets/images/settings-page/8-compensate-member.svg";
import { ReactComponent as ArrowDown } from "../../assets/images/dropdown.svg";
import { get as _get, find as _find, uniqBy as _uniqBy, findIndex as _findIndex } from 'lodash';
import { ReactComponent as PolygonIcon } from '../../assets/svg/polygon.svg';
import { ReactComponent as StarIcon } from '../../assets/svg/star.svg';
import { ReactComponent as DropdownRed } from '../../assets/images/dropdown-red.svg';
import { ReactComponent as DropupRed } from '../../assets/images/dropup-red.svg';
import { useState } from "react";
import CompensateMembersDescriptionModal from "./CompensateMembersDescriptionModal";
import eventEmitter from "utils/eventEmmiter";



const CompensateMembersModal = ({ toggleModal, toggleCompensate }) => {
  const [showCompensateMembersDescriptionModals , setShowCompensateMembersDescriptionModals] = useState(false)

  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            eventEmitter.emit('close-xp-modal')
          }}
          className="overlay"
        ></div>
        <div className="SideModal">
          <div className="closeButtonArea">
            <IconButton
              Icon={
                <AiOutlineClose
                  style={{
                    color: "#C94B32",
                    height: "16px",
                    width: "16px",
                  }}
                />
              }
              bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
              height={37}
              width={37}
              className="sideModalCloseButton"
              onClick={() => {
                eventEmitter.emit('close-xp-modal')
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CompensateIcon style={{marginTop: "100px",marginBottom:'20px', width: "94.48px", height: "50px",color: "#C94B32" }} />
            {/* <Image
              src={XpPoints}
              alt="SWEAT Points icon"
              style={{ marginTop: "100px", width: "94.48px", height: "50px",tintColor: "#C94B32" }}
            /> */}
            <div id="title-type">Compensate Members</div>
          </div>

          {/* //! BODY */}
          {/* <div id="xp-text"
          >
            This feature is super useful during the bootstrapping phase of your organisation. You
            can assign SWEAT points to members for their contributions. Over time, this serves as a
            measure of the relative contribution of different members of the organisation. When your
            organisation has its own token or it has funds to pay, you can compensate members in
            proportion to the SWEAT points they have.
          </div> */}
          <div className='main-picker-container'>
                                <div className='currency'>
                                    <div className='currency-container'>
                                        {_get(null, 'compensation.symbol', 'SWEAT') === 'MATIC' ? <PolygonIcon/> : <StarIcon/>}
                                        <div>{ "1 SWT = "}</div>
                                    </div>
                                </div>
          <div className='picker-container'>
                                <div className='number-input'>
                                    <NumberInput onChange={e => {}} defaultValue={0} style={{ width: (64 + 50), height:50, borderWidth:1, borderColor:'rgba(27, 43, 65, 0.1)',borderRightWidth:0, borderRadius: '10px 0px 0px 10px' }} step={1} min={0}>
                                        <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 64, backgroundColor: '#F5F5F5', borderTopRightRadius:0, borderBottomRightRadius:0,  borderTopLeftRadius:10, borderBottomLeftRadius:10, borderWidth: 0 }}/>
                                        <NumberInputStepper style={{ width: 50, backgroundColor: 'transparent', borderRadius: '0px 10px 10px 0px' }}>
                                            <NumberIncrementStepper color="#C94B32" children={<DropupRed/>} />
                                            <NumberDecrementStepper color="#C94B32" children={<DropdownRed/>}  style={{ borderTopWidth: 0  }} />
                                        </NumberInputStepper> 
                                    </NumberInput>
                                </div>
                                <Select defaultValue={"MATIC"} bg='#F5F5F5' color='#76808D' variant='unstyled' style={{borderRadius: '0px 10px 10px 0px',borderWidth:1, borderLeftWidth:0, borderColor:'rgba(27, 43, 65, 0.1)',boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)', height:50, padding:'0px 50px 0px 20px'}} iconSize={15} icon={<ArrowDown/>}>
                                  <option value='SWEAT'>SWEAT</option>
                                  <option value='MATIC'><PolygonIcon/> MATIC</option>
                                </Select>
                            </div>
                            </div>
          <Button onClick={()=>setShowCompensateMembersDescriptionModals(true)} id="button-save" style={{padding:'20px 100px'}}>{'Next'}</Button>
          {/* <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label class="switch">
                  <input defaultChecked={true} onChange={(e, d) => {}} type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">ENABLED</div>
              </div> */}
          {/* //! FOOTER */}
          {/* <div className="button-section">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                toggleModal();
                toggleXp();
              }}
            >
              Cancel
            </Button>
            <Button id="button-save">SAVE CHANGES</Button>
          </div> */}
        </div>
      </div>
      {showCompensateMembersDescriptionModals && (
        <CompensateMembersDescriptionModal toggleCompensate={()=>setShowCompensateMembersDescriptionModals(false)} />
      )}
    </>
  );
};

export default CompensateMembersModal;