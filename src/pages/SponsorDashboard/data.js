import { COUNTRIES, PROFILE_SETTINGS } from "enum";

function getCount(allUsers, field, value) {
  return allUsers.reduce((previousValue, currentValue) => {
    if (currentValue[field] === value) {
      previousValue += 1;
    }

    return previousValue;
  }, 0);
}

export const options1 = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return (
            `${context.label}: ` +
            Number(context.parsed.y ? context.parsed.y : context.parsed) +
            "%"
          );
        },
      },
    },
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Open to receiving information/being contacted via email about open job positions.",
      font: { size: "20px" },
    },
  },
};

function getPercentage(originalNum, totalNum) {
  return Math.round((originalNum / totalNum) * 100);
}

export function getDoughnutData1(allUsers) {
  return {
    labels: ["Yes", "No"],
    datasets: [
      {
        label:
          "Open to receiving information/being contacted via email about open job positions.",
        data: [
          getPercentage(
            getCount(allUsers, "isOpenReceivingEmail", 1),
            allUsers.length
          ),
          getPercentage(
            getCount(allUsers, "isOpenReceivingEmail", -1),
            allUsers.length
          ),
        ],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };
}

export const options2 = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return (
            `${context.label}: ` +
            Number(context.parsed.y ? context.parsed.y : context.parsed) +
            "%"
          );
        },
      },
    },
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "What best defines your current or most recent job level?",
      font: { size: "20px" },
    },
  },
};

export function getDoughnutData2(allUsers) {
  const cSuite = getCount(allUsers, "recentJobLevel", "C-Suite");
  const VP = getCount(allUsers, "recentJobLevel", "VP or SVP");
  const director = getCount(allUsers, "recentJobLevel", "Director");
  const manager = getCount(allUsers, "recentJobLevel", "Manager");
  const professional = getCount(allUsers, "recentJobLevel", "Professional");
  const junior = getCount(allUsers, "recentJobLevel", "Junior");
  const noInfo =
    allUsers.length -
    (cSuite + VP + director + manager + professional + junior);

  return {
    labels: [
      "C-Suite",
      "VP or SVP",
      "Director",
      "Manager",
      "Professional",
      "Junior",
      "No Info",
    ],
    datasets: [
      {
        label: "What best defines your current or most recent job level?",
        data: [
          getPercentage(cSuite, allUsers.length),
          getPercentage(VP, allUsers.length),
          getPercentage(director, allUsers.length),
          getPercentage(manager, allUsers.length),
          getPercentage(professional, allUsers.length),
          getPercentage(junior, allUsers.length),
          getPercentage(noInfo, allUsers.length),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(22, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(22, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
}

export const options3 = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return (
            `${context.label}: ` +
            Number(context.parsed.y ? context.parsed.y : context.parsed) +
            "%"
          );
        },
      },
    },
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "In what area of HR do you currently work or most recently worked?",
      font: { size: "20px" },
    },
  },
  scales: {
    x: {
      grid: {
        drawBorder: true,
        drawOnChartArea: false,
      },
    },
    y: {
      grid: {
        drawBorder: true,
        drawOnChartArea: false,
      },
    },
  },
};

function getCountRecentWorkArea(allUsers, field, value) {
  return allUsers.reduce((previousValue, currentValue) => {
    if (currentValue[field].includes(value)) {
      previousValue += 1;
    }

    return previousValue;
  }, 0);
}

export function getDoughnutData3(allUsers) {
  const compensationBenefits = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Compensation/Benefits"
  );
  const cultureEmployeeExperience = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Culture/Employee Experience"
  );
  const laborRelationsPolicy = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Labor relations/Policy"
  );
  const learningTalentDevelopment = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Learning / Talent Development"
  );
  const organizationalChange = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Organizational Change Management / Transformation"
  );
  const organizationalDesign = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Organizational Design"
  );
  const peopleAnalytics = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "People Analytics"
  );
  const talentAcquisition = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Talent acquisition/recruitment"
  );
  const talentManagement = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "Talent Management"
  );
  const allOfTheAbove = getCountRecentWorkArea(
    allUsers,
    "recentWorkArea",
    "all"
  );

  return {
    labels: [
      "Compensation/Benefits",
      "Culture/Employee Experience",
      "Labor relations/Policy",
      "Learning / Talent Development",
      "Organizational Change Management / Transformation",
      "Organizational Design",
      "People Analytics",
      "Talent acquisition/recruitment",
      "Talent Management",
      "All of the Above",
    ],
    datasets: [
      {
        data: [
          getPercentage(compensationBenefits, allUsers.length),
          getPercentage(cultureEmployeeExperience, allUsers.length),
          getPercentage(laborRelationsPolicy, allUsers.length),
          getPercentage(learningTalentDevelopment, allUsers.length),
          getPercentage(organizationalChange, allUsers.length),
          getPercentage(organizationalDesign, allUsers.length),
          getPercentage(peopleAnalytics, allUsers.length),
          getPercentage(talentAcquisition, allUsers.length),
          getPercentage(talentManagement, allUsers.length),
          getPercentage(allOfTheAbove, allUsers.length),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(22, 159, 64, 0.2)",
          "rgba(11, 72, 134, 0.2)",
          "rgba(14, 69, 222, 0.2)",
          "rgba(39, 39, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(22, 159, 64, 1)",
          "rgba(11, 72, 134, 1)",
          "rgba(14, 69, 222, 1)",
          "rgba(39, 39, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
}

export const optionCountry = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return (
            `${context.label}: ` +
            Number(context.parsed.y ? context.parsed.y : context.parsed) +
            "%"
          );
        },
      },
    },
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Countries",
      font: { size: "20px" },
    },
  },
};

function findCountry(country) {
  const retVal = COUNTRIES.find((cntry) => cntry.value === country);

  return retVal.text;
}

function random_rgba() {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return {
    backgroundColor:
      "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ", 0.2)",
    borderColor:
      "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ", 1)",
  };
}

export function getCountries(allUsers) {
  let countriesCount = {
    // restOfTheWorld: 0,
  };

  allUsers.map((user) => {
    return (countriesCount[user.location] = 0);
  });

  allUsers.map((user) => {
    return (countriesCount[user.location] += 1);
  });

  for (let [key, value] of Object.entries(countriesCount)) {
    if (value === 0) {
      delete countriesCount[key];
    }
  }

  let labels = [];
  let data = [];

  for (let [key, value] of Object.entries(countriesCount)) {
    const country = findCountry(key);

    labels.push(country);
    data.push(getPercentage(value, allUsers.length));
  }

  return {
    labels: labels,
    datasets: [
      {
        label: "Countries",
        data: data,
        backgroundColor: labels.map(() => {
          return random_rgba().backgroundColor;
        }),
        borderColor: labels.map(() => {
          return random_rgba().borderColor;
        }),
        borderWidth: 1,
      },
    ],
  };
}

export const sizeOfOrganizationOption = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return (
            `${context.label}: ` +
            Number(context.parsed.y ? context.parsed.y : context.parsed) +
            "%"
          );
        },
      },
    },
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "What is the size of the organization your work for?",
      font: { size: "20px" },
    },
  },
};

export function sizeOfOrganizationChart(allUsers) {
  const _1_100 = getCount(allUsers, "sizeOfOrganization", "1-100");
  const _101_500 = getCount(allUsers, "sizeOfOrganization", "101 - 500");
  const _501_1000 = getCount(allUsers, "sizeOfOrganization", "501-1000");
  const _1001_5000 = getCount(allUsers, "sizeOfOrganization", "1001 - 5000");
  const _5001_10000 = getCount(allUsers, "sizeOfOrganization", "5001-1000");
  const over10000 = getCount(allUsers, "sizeOfOrganization", "Over 10000");

  return {
    labels: [
      "1 - 100",
      "101 - 500",
      "501 - 1000",
      "1001 - 5000",
      "5001 - 10000",
      "Over 10000",
    ],
    datasets: [
      {
        data: [
          getPercentage(_1_100, allUsers.length),
          getPercentage(_101_500, allUsers.length),
          getPercentage(_501_1000, allUsers.length),
          getPercentage(_1001_5000, allUsers.length),
          getPercentage(_5001_10000, allUsers.length),
          getPercentage(over10000, allUsers.length),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
}

export const topicsOfInterestOption = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          return (
            `${context.label}: ` +
            Number(context.parsed.y ? context.parsed.y : context.parsed) +
            "%"
          );
        },
      },
    },
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "Topics of interest",
      font: { size: "20px" },
    },
  },
  scales: {
    x: {
      grid: {
        drawBorder: true,
        drawOnChartArea: false,
      },
    },
    y: {
      grid: {
        drawBorder: true,
        drawOnChartArea: false,
      },
    },
  },
};

const findTopicOfInterest = (topic) => {
  const retVal = PROFILE_SETTINGS.TOPICS.find((tpc) => tpc.value === topic);

  return retVal.text;
};

export function topicsOfInterestChart(allUsers) {
  let topicsOfInterestCount = {};

  allUsers.map((user) => {
    return user.topicsOfInterest.map((topic) => {
      const itExists = PROFILE_SETTINGS.TOPICS.some(
        (tpc) => tpc.value === topic
      );

      if (itExists) {
        return (topicsOfInterestCount[topic] = 0);
      }

      return null;
    });
  });

  allUsers.map((user) => {
    return user.topicsOfInterest.map((topic) => {
      const itExists = PROFILE_SETTINGS.TOPICS.some(
        (tpc) => tpc.value === topic
      );

      if (itExists) {
        return (topicsOfInterestCount[topic] += 1);
      }

      return null;
    });
  });

  for (let [key, value] of Object.entries(topicsOfInterestCount)) {
    if (value === 0) {
      delete topicsOfInterestCount[key];
    }
  }

  let labels = [];
  let data = [];

  for (let [key, value] of Object.entries(topicsOfInterestCount)) {
    const topic = findTopicOfInterest(key);

    labels.push(topic);
    data.push(getPercentage(value, allUsers.length));
  }

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: labels.map(() => {
          return random_rgba().backgroundColor;
        }),
        borderColor: labels.map(() => {
          return random_rgba().borderColor;
        }),
        borderWidth: 1,
      },
    ],
  };
}
