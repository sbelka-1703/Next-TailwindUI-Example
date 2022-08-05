import Layout from "../../../components/layout/Layout";
import RoleCard from "../../../components/SelectRoles/RoleCard";
import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Selector from "../../../components/SelectRoles/Selector";
import RoleDataForm from "../../../components/SelectRoles/RoleDataForm";
import { findRoleTemplates } from "../../../redux/slices/roleTemplatesSlice";
import { findProject, updateProject } from "../../../redux/slices/projectSlice";
import { useRouter } from "next/router";
function ProjectSelectRoles() {
  const dispatch = useDispatch();
  const router = useRouter();
  const roles = useSelector((state) => state.roleTemplates.roleTemplates);
  const project = useSelector((state) => state.projectInspect);
  const [pendingRoles, setPendingRoles] = useState([]);
  const [inputRole, setInputRole] = useState({});
  const [currentRoleIndex, setCurrentRoleIndex] = useState(null);
  const [savedRoles, setSavedRoles] = useState([]);

  const setInputRoleCallback = useCallback((item) => {
    setInputRole(item);
  }, []);

  const saveRoleCallback = useCallback(
    async (item) => {
      await setSavedRoles([...savedRoles, item]);
      const newPendingRoles = pendingRoles.filter(
        (role, index) => index !== currentRoleIndex
      );
      await setPendingRoles(newPendingRoles);
      await setCurrentRoleIndex(null);
    },
    [pendingRoles, currentRoleIndex, savedRoles]
  );

  useEffect(() => {
    if (!savedRoles.length) return;
    const params = {
      role: savedRoles.map((role) => {
        return {
          ...role,
          skills: role.skills.map((skill) => {
            return skill.level
              ? { _id: skill._id, level: skill.level }
              : { _id: skill._id };
          }),
        };
      }),
      returnRole: true,
    };
    dispatch(updateProject(params));
  }, [savedRoles]);

  const setRoleCallback = useCallback(
    async (item) => {
      const newPendingRoles = [...pendingRoles];
      newPendingRoles[currentRoleIndex] = item;
      setPendingRoles(newPendingRoles);
    },
    [pendingRoles, currentRoleIndex]
  );

  const handleAddRole = (e) => {
    setPendingRoles([...pendingRoles, inputRole]);
    setInputRole({});
  };

  useLayoutEffect(() => {
    let params = {
      fields: {},
    };
    dispatch(findRoleTemplates(params));
    if (router.query.projectId) {
      params = {
        _id: router.query.projectId,
        returnRole: true,
      };
      dispatch(findProject(params));
    }
  }, [dispatch, router.query.projectId]);

  useEffect(() => {
    if (!project?.role?.length) return;
    setSavedRoles(project.role);
  }, [project]);

  useEffect(() => {
    console.log("pendingRoles", pendingRoles);
  }, []);

  return (
    // <div className="grid grid-cols-1 gap-y-3 md:gap-x-3 md:grid-cols-5">
    <div className="flex justify-between items-center">
      <div className="flex gap-10 flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold">SCOPE YOUR ROLES</h3>
        <div className="flex gap-5 flex-col justify-center items-center">
          {pendingRoles.map((role, index) => (
            <div
              key={index}
              onClick={() => setCurrentRoleIndex(index)}
              className={`cursor-pointer`}
            >
              <RoleCard
                setRoleCallback={setRoleCallback}
                currentRoleIndex={currentRoleIndex}
                index={index}
                highlighter={true}
              />
            </div>
          ))}
          {/* {roles.length && (
            <Selector
              key={inputRole}
              name="title"
              options={[...roles, { title: "New Role" }]}
              setDataCallback={setInputRoleCallback}
              value={inputRole}
            />
          )} */}
          <button
            className="bg-green-400 rounded-sm font-bold px-2 py-1"
            disabled={!inputRole.title}
            onClick={handleAddRole}
          >
            Add Role
          </button>
        </div>
      </div>
      <div className="col-span-3">
        {currentRoleIndex >= 0 && pendingRoles[currentRoleIndex] && (
          <RoleDataForm
            role={pendingRoles[currentRoleIndex]}
            key={`${pendingRoles[currentRoleIndex]._id}${currentRoleIndex}`}
            setRoleCallback={setRoleCallback}
            saveRoleCallback={saveRoleCallback}
          />
        )}
      </div>
      <div className="col-span-1">
        <h3 className="text-2xl font-semibold">COMPLETED PROFILES</h3>
        {savedRoles.map((role, index) => (
          <RoleCard role={role} key={index} />
        ))}
      </div>
      {/* <p>{JSON.stringify(pendingRoles)}</p> */}
    </div>
  );
}

ProjectSelectRoles.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProjectSelectRoles;
