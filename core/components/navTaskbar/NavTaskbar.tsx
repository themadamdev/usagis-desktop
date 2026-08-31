import { useState } from 'react';
import styles from './navTaskbar.module.scss';
import { TaskBar, List, Modal, TitleBar } from '@react95/core';
import { WindowsExplorer, ReaderClosed } from '@react95/icons';
// import SocialsIcons from 'core/components/socialsIcons/SocialsIcons';

function NavTaskbar() {
  const [first, toggleFirst] = useState(false);
  const [second, toggleSecond] = useState(false);
  const closeFirst = () => toggleFirst(false);
  const closeSecond = () => toggleSecond(false);


  return (<>
    {/* {first && <Modal icon={<WindowsExplorer variant="16x16_4" />} title="Windows Explorer" titleBarOptions={[<TitleBar.Close key="close" onClick={closeFirst} />]} width="300px" height="200px" />}

    {second && <Modal dragOptions={{
      defaultPosition: {
        x: 50,
        y: 50
      }
    }} width="300px" height="200px" icon={<ReaderClosed variant="16x16_4" />} title="Local Disk (C:)" titleBarOptions={[<TitleBar.Close key="close" onClick={closeSecond} />]} />} */}

    <TaskBar list={<List>
      <List.Item icon={<ReaderClosed variant="32x32_4" />} onClick={() => toggleSecond(true)}>
        Moon Kingdom (C:)
      </List.Item>
      <List.Item icon={<WindowsExplorer variant="32x32_4" />} onClick={() => {
        toggleFirst(true);
      }}>
        Crystal Explorer
      </List.Item>
    </List>} />
  </>
  )
  // parameters: {
  //   design: {
  //     type: 'figma',
  //     url: 'https://www.figma.com/file/2cbigNitjcruBDZT12ixIq/React95-Design-Kit?node-id=3%3A17'
  //   }
  // }


  // return (
  //   <footer className={styles.footer}>
  //     <a className={styles.startButton}></a>
  //     {/* <SocialsIcons /> */}
  //     <div className={styles.timeBox}>
  //       &#169; Developed by J.L. White 🤍 
  //       {time.toLocaleTimeString()}
  //     </div>
  //   </footer>
  // )
}

export default NavTaskbar;