import React, { useState } from "react";

const packagesData = [
  {
    id: 1,
    packageName: "Civil 1",
    rate: 567.8,
    total: 2986792,
    activities: [
      {
        id: 11,
        activityName: "Activity 1",
        workItems: [
          { id: 111, name: "Work Item 1" },
          { id: 112, name: "Work Item 2" },
          { id: 113, name: "Work Item 3" },
        ],
      },
      {
        id: 12,
        activityName: "Activity 2",
        workItems: [
          { id: 121, name: "Work Item 1" },
          { id: 122, name: "Work Item 2" },
        ],
      },
      {
        id: 13,
        activityName: "Activity 3",
        workItems: [{ id: 131, name: "Work Item 1" }],
      },
      {
        id: 14,
        activityName: "Activity 4",
        workItems: [
          { id: 141, name: "Work Item 1" },
          { id: 142, name: "Work Item 2" },
          { id: 143, name: "Work Item 3" },
        ],
      },
    ],
  },
  {
    id: 2,
    packageName: "Civil 2",
    rate: 567.8,
    total: 2986792,
    activities: [
      {
        id: 21,
        activityName: "Activity 1",
        workItems: [
          { id: 211, name: "Work Item 1" },
          { id: 212, name: "Work Item 2" },
          { id: 213, name: "Work Item 3" },
          { id: 214, name: "Work Item 4" },
        ],
      },
      {
        id: 22,
        activityName: "Activity 2",
        workItems: [
          { id: 221, name: "Work Item 1" },
          { id: 222, name: "Work Item 2" },
        ],
      },
    ],
  },
];

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleTabChange = (newValue) => {
    setTabIndex(newValue);
  };

  const handleExpandPackage = (id) => {
    setExpandedPackage((prev) => (prev === id ? null : id));
  };

  const handleExpandActivity = (id) => {
    setExpandedActivity((prev) => (prev === id ? null : id));
  };

  const handleSelectAll = (packageId, activityId, isSelected) => {
    let newSelected = [...selectedItems];

    const findWorkItems = (packageId, activityId = null) => {
      let workItems = [];
      const pkg = packagesData.find((pkg) => pkg.id === packageId);
      if (activityId) {
        const activity = pkg.activities.find((act) => act.id === activityId);
        workItems = activity.workItems.map((item) => item.id);
      } else {
        pkg.activities?.forEach((activity) => {
          workItems.push(...activity.workItems.map((item) => item.id));
        });
      }
      return workItems;
    };

    const items = findWorkItems(packageId, activityId);
    if (isSelected) {
      newSelected = newSelected.filter((id) => !items.includes(id));
    } else {
      newSelected.push(...items);
    }

    setSelectedItems(newSelected);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isPackageSelected = (packageId) => {
    const packageWorkItems = packagesData
      .find((pkg) => pkg.id === packageId)
      ?.activities.flatMap((activity) => activity.workItems.map((item) => item.id));
    return packageWorkItems.every((id) => selectedItems.includes(id));
  };

  const isActivitySelected = (packageId, activityId) => {
    const activityWorkItems = packagesData
      .find((pkg) => pkg.id === packageId)
      ?.activities.find((activity) => activity.id === activityId)
      ?.workItems.map((item) => item.id);
    return activityWorkItems.every((id) => selectedItems.includes(id));
  };

  return (
    <div className="p-6 text-lg"> 
    <div className="flex justify-between items-center mb-6">
      <button className="text-2xl flex items-center"> 
        <span className="mr-1">&lt;</span> Create Workorder
      </button>
      <button className="bg-teal-500 text-white px-4 py-2 rounded text-xl"> 
        Save
      </button>
    </div>
  
    <div className="border-b text-2xl mb-4"> 
      <button
        className={`px-4 py-2 ${
          tabIndex === 0 ? "border-b-2 border-black text-black" : "text-gray-400"
        }`}
        onClick={() => handleTabChange(0)}
      >
        Overview
      </button>
      <button
        className={`px-4 py-2 ${
          tabIndex === 1 ? "border-b-2 border-black text-black" : "text-gray-400"
        }`}
        onClick={() => handleTabChange(1)}
      >
        Other
      </button>
    </div>
  
    {tabIndex === 0 && (
      <div className="mt-4">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-lg"> 
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300 text-left">
                <input type="checkbox" className="mr-2" />
                Packages
              </th>
              <th className="p-2 border border-gray-300 text-center">Rate (in sqft)</th>
              <th className="p-2 border border-gray-300 text-center">Total</th>
              <th className="p-2 border border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {packagesData.map((pkg) => (
              <React.Fragment key={pkg.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="p-2 flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isPackageSelected(pkg.id)}
                      onChange={() =>
                        handleSelectAll(pkg.id, null, isPackageSelected(pkg.id))
                      }
                    />
                    {pkg.packageName}
                  </td>
                  <td className="p-2 text-center">{pkg.rate}</td>
                  <td className="p-2 text-center">₹ {pkg.total.toLocaleString()}</td>
                  <td className="p-2 text-center">
                    {pkg.activities && (
                      <button onClick={() => handleExpandPackage(pkg.id)}>
                        {expandedPackage === pkg.id ? "-" : "+"}
                      </button>
                    )}
                  </td>
                </tr>
                {expandedPackage === pkg.id &&
                  pkg.activities?.map((activity) => (
                    <React.Fragment key={activity.id}>
                      <tr className="border-t hover:bg-gray-50">
                        <td className="pl-8 p-2 flex items-center border-l-2 border-gray-300">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={isActivitySelected(pkg.id, activity.id)}
                            onChange={() =>
                              handleSelectAll(
                                pkg.id,
                                activity.id,
                                isActivitySelected(pkg.id, activity.id)
                              )
                            }
                          />
                          {activity.activityName}
                        </td>
                        <td className="p-2 text-center">{pkg.rate}</td>
                        <td className="p-2 text-center">₹ {pkg.total.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          {activity.workItems && (
                            <button onClick={() => handleExpandActivity(activity.id)}>
                              {expandedActivity === activity.id ? "-" : "+"}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedActivity === activity.id &&
                        activity.workItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="pl-16 p-2 flex items-center border-l-2 border-gray-300">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                              />
                              {item.name}
                            </td>
                            <td className="p-2 text-center">{pkg.rate}</td>
                            <td className="p-2 text-center">₹ {pkg.total.toLocaleString()}</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {tabIndex === 1 && (
      <div className="mt-4">
        <h2 className="text-xl">Hello World!</h2> 
      </div>
    )}
  </div>
  
  );
};

export default App;
